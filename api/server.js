import koa from 'koa';
import Router from 'koa-router';

import config from './knexfile';

import initBookshelf from './db'
import ApiController from './controller';

const env = process.env.NODE_ENV || 'development';

let bodyParser = require('koa-bodyparser');

let bookshelf = initBookshelf(config[env]);
let controller = new ApiController(bookshelf);

let api = Router();

api.get('/test-get', controller.testGet.bind(controller));
api.post('/test-post', controller.testPost.bind(controller));

api.post('/houses', controller.registerHouse.bind(controller));
api.post('/session', controller.login.bind(controller));

api.get('/house/:housename', controller.getHouse.bind(controller));

api.post('/house/', controller.updateHouse.bind(controller));
api.post('/house/password', controller.changePassword.bind(controller));
api.post('/house/verify/:hash', controller.verifyEmail.bind(controller));

api.post('/resetpassword', controller.resetPassword.bind(controller));
api.post('/newpassword/:hash', controller.newPassword.bind(controller));

api.post('/logout', controller.logout.bind(controller));

const app = new koa();

app.use(bodyParser({
  detectJSON: function (ctx) {
    return /\.json$/i.test(ctx.path);
  }
}));

app.use(api.routes());

//const util = require('util');
const listener = app.listen(8009, ()=>{
  console.log('API running in port 8009');
});