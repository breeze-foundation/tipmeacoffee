const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const breej = require('breej')
const CryptoJS = require("crypto-js")
const fs = require('fs')
const fileUpload = require('express-fileupload')
const fetch = require("node-fetch")
const axios = require('axios')

const requestIp = require('request-ip');
const RateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

require('dotenv').config();
const { connectDatabase } = require("./src/utils/db");
connectDatabase().then(() => {console.log("Connected to DB. Initializing client."); });


const app = express();

global.api_url = 'https://api.tipmeacoffee.com';
const { apiCheck } = require('./src/utils/apiCheck')
app.use(apiCheck)
breej.init({ api: api_url, bwGrowth: 36000000000, vpGrowth: 120000000000 })

global.msgkey = process.env.msgKey 
global.iv = process.env.breezval
global.getAccountPub = (username) => { return new Promise((res, rej) => { breej.getAccount(username, function (error, account) { if (error) rej(error); if (!account) rej(); if (account.pub) res(account.pub); }) }) }
global.validateToken = async (username, token) => { if (!username || !token) return false; try { var decrypted = CryptoJS.AES.decrypt(token, msgkey, { iv: iv }); return breej.privToPub(decrypted.toString(CryptoJS.enc.Utf8)) === await getAccountPub(username); } catch (err) { return false; } }
global.nkey = async(token) => {try{let decrypted = CryptoJS.AES.decrypt(token, msgkey, { iv: iv }); let uKey = decrypted.toString(CryptoJS.enc.Utf8);return uKey;}catch(err){return false;} }
global.getNotices = async (user) =>{ const response = await fetch(api_url+`/unreadnotifycount/`+user);if (response.status === 200) {return response.json()} else {return null} }
global.getAccount = async (user) =>{ const response = await fetch(api_url+`/account/`+user); if (response.status === 200) {return response.json()} else {return null} }
global.getPost = async (user, postLink) =>{ const response = await fetch(api_url+`/content/`+user+`/`+postLink); if (response.status === 200) {return response.json()} else {return null} }
global.categoryList = ['News','Cryptocurrency','Food','Sports','Technology','Lifestyle','Health','Gaming','Business','General', 'Search'];
global.spammers = fs.readFileSync('./src/views/common/spammers.txt').toString().split("\n");

const limiter = RateLimit({windowMs: 1*60*1000,max: 1000000,message:'Too many requests'});
const voteLimiter = RateLimit({ windowMs: 1 * 60 * 1000, max: 100, message: 'Too many upvotes from this IP, please try again after an hour', standardHeaders: true, legacyHeaders: false, })

app.use(limiter);
app.use(requestIp.mw());

app.use(async (req, res, next) => {
    try {
        const response = await axios.get(`${api_url}/new?category=search`);
        if (response.status === 200) {
            const articles = response.data;
            if (articles && articles.length > 0) {
                res.locals.aiArticles = articles; 
            } else {
                res.locals.aiArticlesError = 'No articles found';
            }
        } else {
            res.locals.aiArticlesError = `API returned status ${response.status}`;
        }
        next();
    } catch (error) {
        res.locals.aiArticlesError = 'Error fetching ai articles';
        next();
    }
});
  
const main = require('./src/routes/main');
const post = require('./src/routes/post');
const answerRouter = require('./src/routes/answerPage');
const accountRouter = require('./src/routes/accounts')
const publish = require('./src/routes/publish')
const engine = require('./src/routes/engine')
const walletRouter = require('./src/routes/wallet')
const profileRouter = require('./src/routes/profile')
const voteRouter = require('./src/routes/vote')
const shareRouter = require('./src/routes/share')
const askRouter = require('./src/routes/ask')
const catgRouter = require('./src/routes/category')
const notifyRouter = require('./src/routes/notify')
const witRouter = require('./src/routes/witness')


app.use(mongoSanitize());
app.use(helmet({contentSecurityPolicy: false, }) )
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/images', express.static(__dirname + 'public/images'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/uploads', express.static(__dirname + 'public/uploads'))
app.use('/ads.txt', express.static(__dirname + 'public/ads.txt'))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }))
app.use(fileUpload());

app.set('views', './src/views')
app.set('view engine', 'ejs')
app.use(cookieParser())

app.use('/post/:name/:link', post.page);
app.use('/search/:name/:link', answerRouter.answerPage);
app.use('/sharelinks',publish.share)
app.use('/askengine',engine.post)
app.use('/postlinks',publish.post)
app.use('/loginuser',accountRouter.login)
app.use('/signup',accountRouter.signup)
app.use('/logout',accountRouter.logout)
app.use('/wallet',walletRouter.wallet)
app.use('/withdraw',walletRouter.withdraw)
app.use('/boost',walletRouter.boost)
app.use('/transfer',walletRouter.transfer)
app.use('/keys',walletRouter.updateKeys)
app.use('/profile/:name',profileRouter.profile)
app.use('/pupdate',profileRouter.profileUpdate)
app.use('/follow',profileRouter.follow)
app.use('/unfollow',profileRouter.unfollow)
app.use('/upvote', voteLimiter, voteRouter.upvote)
app.use('/share', shareRouter.newPost)
app.use('/ask', askRouter.newAsk)
app.use('/category/:catg', catgRouter.catgPage)
app.use('/tags/:tag', catgRouter.tagPage)
app.use('/followCatg', catgRouter.followCatg)
app.use('/unfollowCatg', catgRouter.unfollowCatg)
app.use('/notifications', notifyRouter.notifications)
app.use('/notify', notifyRouter.notify)
app.use('/witnesses', witRouter.witnesses)
app.use('/witup', witRouter.witup)
app.use('/witunup', witRouter.witunup)
app.use('', main)

module.exports = app;