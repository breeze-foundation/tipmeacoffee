const express = require('express')
const breej = require('breej')
require('dotenv').config();
const marked = require('marked');

const helper = require('./helper');
const axios = require('axios')

const tldts = require("tldts");
const randomstring = require("randomstring")
const getSlug = require('speakingurl')
const isUrl = require("is-url")
const Meta = require('html-metadata-parser')
const { limit, substr } = require('stringz')
const fetchTags = helper.getTags

const askEngineName = process.env.ASK_ENGINE_NAME;
const askEngineKey = process.env.ASK_ENGINE_KEY;
const askEngineModel = process.env.ASK_ENGINE_MODEL;
const sdk = require('api')(askEngineName);
sdk.auth(askEngineKey);



async function post(req, res) {
  if(req.cookies && req.cookies.breeze_username && req.cookies.breeze_username !=='' && req.cookies.token && req.cookies.token !=='' && await validateToken(req.cookies.breeze_username, req.cookies.token)) 
  {
    let author = req.cookies.breeze_username;
    let token = req.cookies.token;
    if(spammers.includes(author)){return res.send({ error: true, message: 'You are not allowed to post due to spamming!' })}
    const { title } = req.body;
    if (!title) {
      return res.send({ error: 'Invalid or missing query.' });
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

  
    //   let post = req.body;
    //   let allowed_tags=/^[a-z\d\_\s]+$/i;
    //   if (!allowed_tags.test(post.tags)) {return res.send({ error: true, message: 'Only alphanumeric tags, no Characters.' })}
    //   let tags=post.tags.replace(/\s\s+/g, ' ');let tags_arr=tags.trim().split(' ');
    //   if (post.description.length < 60) {return res.send({ error: true, message: 'Add description of minimum 60 characters' })}
    //   if (post.description.length > 300) {return res.send({ error: true, message: 'Content must be less than 300 characters' })}
    //   let description=post.description;
      
    //   let status_link=randomstring.generate({ length: 13, capitalization: 'lowercase', readable: true, charset: 'numeric'});
    //   let permlink = author+'-status-'+status_link;
    //   if (tags_arr.length < 2) {return res.send({ error: true, message: 'Add at least two related tags' })}
    //   let wifKey = await nkey(token);
    //   if(req.body.type == '3'){
    //     let content = { body: description, category: 'status', type: req.body.type, tags: tags_arr };
    //     let newTx = { type: 4, data: { link: permlink, json: content } };
    //     breej.getAccount(author, async function (error, account) {
    //       if (breej.privToPub(wifKey) !== account.pub) {return res.send({ error: true, message: 'Unable to validate user' });
    //       } else { newTx = breej.sign(wifKey, author, newTx);
    //         breej.sendTransaction(newTx, function (err, response) { if (err === null) { return res.send({ error: false, link: permlink, author:author }); } else { return res.send({ error: true, message: err['error'] }); } })
    //       }
    //     })
    //   }else if(req.body.type == '2') {
    //     const file = req.files.file;const fileName = escape(req.body.filename);const filePath = path.resolve('files/'+fileName);
    //     file.mv(filePath, async (err) => {
    //       if (err) {return res.send({error: true, message: 'IPFS issues for image uploading'});}
    //       const fileHash = await addFile(fileName, filePath)
    //       fs.unlink(filePath, (err) =>{ if (err) console.log(err); })
    //       image='https://tipmeacoffee.org/ipfs/'+fileHash;
    //       let content = { body: description, category: 'status', image: image, type: req.body.type, tags: tags_arr };
    //       let newTx = { type: 4, data: { link: permlink, json: content } };
    //       breej.getAccount(author, async function (error, account) {
    //         if (breej.privToPub(wifKey) !== account.pub) {return res.send({ error: true, message: 'Unable to validate user' });
    //         } else { newTx = breej.sign(wifKey, author, newTx);
    //           breej.sendTransaction(newTx, function (err, response) { if (err === null) { return res.send({ error: false, link: permlink, author:author }); } else { return res.send({ error: true, message: err['error'] }); } })
    //         }
    //       })
    //     })
    //   }else if(req.body.type == '1') {
    //     if(!post.title){return res.send({ error: true, message: 'Not a valid title' });
    //     }else{ let permlink = getSlug(post.title);let description=limit(post.description, 120, '');
    //       let video=videoParser.parse(post.exturl);let videoId=video.id
    //       let content = { title: post.title, body: description, category: post.category, url: post.exturl, image: post.image, type: req.body.type, videoid: videoId, tags: tags_arr };
    //       let newTx = { type: 4, data: { link: permlink, json: content } };
    //       breej.getAccount(author, async function (error, account) {
    //         if (breej.privToPub(wifKey) !== account.pub) {return res.send({ error: true, message: 'Unable to validate user' });
    //         } else { newTx = breej.sign(wifKey, author, newTx);
    //           breej.sendTransaction(newTx, function (err, response) {
    //             if (err === null) { return res.send({ error: false, link: permlink,author:author }); } else { return res.send({ error: true, message: err['error'] }); }
    //           })
    //         }
    //       })
    //     }
    //   }else if(req.body.type == '0') {
    //     if(!post.title){return res.send({ error: true, message: 'Not a valid title' });
    //     }else{ let permlink = getSlug(post.title);let description=limit(post.description, 120, '');
    //       let content = { title: post.title, body: description, category: post.category, url: post.exturl, image: post.image, type: req.body.type, tags: tags_arr };
    //       let newTx = { type: 4, data: { link: permlink, json: content } };
    //       breej.getAccount(author, async function (error, account) {
    //         if (breej.privToPub(wifKey) !== account.pub) {return res.send({ error: true, message: 'Unable to validate user' });
    //         } else { newTx = breej.sign(wifKey, author, newTx);
    //           breej.sendTransaction(newTx, function (err, response) {
    //             if (err === null) { return res.send({ error: false, link: permlink, author: author });} else { return res.send({ error: true, message: err['error'] }); }
    //           })
    //         }
    //       })
    //     }
    //   }else{
    //     if(!post.title){return res.send({ error: true, message: 'Not a valid title' });
    //     }else{ let permlink = getSlug(post.title);let description=limit(post.description, 120, '');
    //       let content = { title: post.title, body: description, category: post.category, url: post.exturl, image: post.image, type: '0', tags: tags_arr };
    //       let newTx = { type: 4, data: { link: permlink, json: content } };
    //       breej.getAccount(author, async function (error, account) {
    //           if (breej.privToPub(wifKey) !== account.pub) {return res.send({ error: true, message: 'Unable to validate user' });
    //           } else { newTx = breej.sign(wifKey, author, newTx);
    //               breej.sendTransaction(newTx, function (err, response) {
    //               if (err === null) { return res.send({ error: false, link: permlink, author: author }); } else { return res.send({ error: true, message: err['error'] }) }
    //               })
    //           }
    //       })
    //     }
    //   }
  } else { return res.send({ error: true, message: 'phew.. User Validation Fails. You must be login' })}
}

module.exports = { post }