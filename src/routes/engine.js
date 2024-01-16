const express = require('express')
const breej = require('breej')
require('dotenv').config();
const marked = require('marked');
const { redisClient, checkDailyAskLimit, incrementDailyAskCount, getDailyAskCount } = require('../utils/redisUtils.js');
const getSlug = require('speakingurl')

const askEngineName = process.env.ASK_ENGINE_NAME;
const askEngineKey = process.env.ASK_ENGINE_KEY;
const askEngineModel = process.env.ASK_ENGINE_MODEL;
const sdk = require('api')(askEngineName);
sdk.auth(askEngineKey);

async function post(req, res) {
  if (
    req.cookies &&
    req.cookies.breeze_username &&
    req.cookies.breeze_username !== '' &&
    req.cookies.token &&
    req.cookies.token !== '' &&
    (await validateToken(req.cookies.breeze_username, req.cookies.token))
  ) {
    let author = req.cookies.breeze_username;
    let token = req.cookies.token;

    if (spammers.includes(author)) {
      return res.send({ error: true, message: 'You are not allowed to post due to spamming!' });
    }
    const { title } = req.body;
    console.log(title)
    if (!title) {
      return res.send({ error: true, message: 'Invalid or missing query.' });
    }
    if (/<[a-z][\s\S]*>/i.test(title)) {
      return res.send({ error: true, message: 'I am unable to answer html queries.' });
    }
    const allowedToPost = await checkDailyAskLimit(author);
    if (!allowedToPost) {
      return res.send({error: true, message: 'Answer Engine is in beta so a temporary daily limit is held for users.' });
    }
    console.log('ip of ' + req.clientIp + ' author is ' + author)
    let permlink = getSlug(title);
    sdk.post_chat_completions({
      model: askEngineModel,
      messages: [
        { role: 'system', content: 'Be precise and concise' },
        { role: 'user', content: title }
      ]
    })
    .then(({ data }) => {
      if (data && data.choices && data.choices[0] && data.choices[0].message) {
        const rawAnswer = data.choices[0].message.content;

        const answer = marked.parse(rawAnswer)
        //res.send({ output: answer });
        incrementDailyAskCount(author);
        getDailyAskCount(author)
        .then((count) => {
          console.log(`User ${author} has asked ${count} questions today.`);
        })
        .catch((error) => {
          console.error('Error fetching count:', error);
        });
        let content = { title: title, body: answer, category: 'search', type: '4' };
        let newTx = { type: 4, data: { link: permlink, json: content } };
        breej.getAccount(author, async function (error, account) {
          let wifKey = await nkey(token);
          if (breej.privToPub(wifKey) !== account.pub) {return res.send({ error: true, message: 'Unable to validate user' });
          } else { 
            newTx = breej.sign(wifKey, author, newTx);
            breej.sendTransaction(newTx, function (err, response) {
              if (err === null) { 
                return res.send({ error: false, link: permlink, author: author }); 
              } else { return res.send({ error: true, message: err['error'] }) }
            })
          }
        })
      } else {
        // If there is missing data or the structure is not as expected, send an error response
        console.error('Invalid or missing data structure:', data);
        res.status(500).send({ error: 'Invalid or missing data structure.' });
      }
    })
    .catch(err => {
      // If there is an error, catch it and send an appropriate error response
      console.error('Error:', err.message);
      res.status(500).send({ error: 'An error occurred while processing the data.' });
    });

  } else { return res.send({ error: true, message: 'phew.. User Validation Fails. You must be login' })}
}

module.exports = { post }