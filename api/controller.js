import _ from 'lodash';
import bcrypt from 'bcrypt';
import bb from 'bluebird';
import { countBreaks } from 'grapheme-breaker';
import uuid from 'uuid';
import crypto from 'crypto';


let bcryptAsync = bb.promisifyAll(bcrypt);

  const util = require('util');

export default class ApiController {
  constructor (bookshelf) {
    this.bookshelf = bookshelf;
  }

  async testGet(ctx, next) {
    ctx.body = {hello: 'world'};
  }
  async testPost(ctx, next) {
    ctx.body = {
      hello: 'post-world',
      body: ctx.request.body
    };
  }

  async registerHouse(ctx, next) {
    let requiredFields = ['house_name', 'password', 'email'];
    let optionalFields = ['firstName', 'lastName'];

    for (let fieldName of requiredFields) {
      if (!(fieldName in ctx.request.body)) {
        ctx.status = 400;
        ctx.body = {error: 'Bad Request'};
        return
      }
    }

    let House = this.bookshelf.model('House');

    {
      let check = await House.where({house_name: ctx.request.body.house_name}).fetch({require: false});
      if (check) {
        ctx.status = 409;
        ctx.body = {error: 'House with this house_name is already registered'};
        return;
      }
    }

    {
      let check = await House.where({email: ctx.request.body.email}).fetch({require: false});
      if (check) {
        ctx.status = 409;
        ctx.body = {error: 'House with this email is already registered'};
        return;
      }
    }

    let moreData = {};
    for (let fieldName of optionalFields) {
      if (fieldName in ctx.request.body) {
        moreData[fieldName] = ctx.request.body[fieldName];
      }
    }

    moreData.first_login = true;

    let house;

    try {
      house = await House.create(ctx.request.body.house_name, ctx.request.body.password, ctx.request.body.email, moreData);
    } catch (e) {
      if (e.code == 23505) {
        ctx.status = 401;
        ctx.body = {error: 'House already exists'};
        return;
      }

      throw e;
    }

    if (ctx.request.session) {
      ctx.request.session.house = house.id;
    }

    createJob('register-house-email', {
      house_name: house.get('house_name'),
      email: house.get('email'),
      hash: house.get('check_hash')
    });

    ctx.body = {success: true, house: house};
  }

  async login(ctx, next) {
    if (!ctx.request.session) {
      ctx.status = 500;
      ctx.body = {error: 'Internal Server Error'};
      console.error('Session engine is not available, have you started redis service?');  // eslint-disable-line no-console
      return;
    }

    let requiredFields = ['house_name', 'password'];

    for (let fieldName of requiredFields) {
      if (!(fieldName in ctx.request.body)) {
        ctx.status = 400;
        ctx.body = {error: 'Bad Request'};
        return;
      }
    }

    let House = this.bookshelf.model('House');

    let house;

    try {
      house = await new House({house_name: ctx.request.body.house_name}).fetch({require: true});
    } catch (e) {
      console.warn('Someone tried to log in as ' + ctx.request.body.house_name + ', but there\'s no such house');  // eslint-disable-line no-console
      ctx.status = 401;
      ctx.body = {success: false};
      return
    }

    let passwordIsValid = await bcryptAsync.compareAsync(ctx.request.body.password, house.get('hashed_password'));

    if (!passwordIsValid) {
      console.warn('Someone tried to log in as ' + ctx.request.body.house_name + ', but used wrong pasword');  // eslint-disable-line no-console
      ctx.status = 401;
      ctx.body = {success: false};
      return
    }

    ctx.request.session.house = house.id;
    house = await House.where({id: ctx.request.session.house}).fetch({require: true});

    ctx.body = { success: true, house };
  }

  async verifyEmail(ctx, next) {
    let House = this.bookshelf.model('House');

    let house;

    try {
      house = await new House({check_hash: ctx.request.params.hash}).fetch({require: true});
    } catch (e) {
      console.warn('Someone tried to verify email, but used invalid hash');  // eslint-disable-line no-console
      ctx.status = 401;
      ctx.body = {success: false};
      return;
    }

    house.set('check_hash', '');
    await house.save(null, {method: 'update'});

    ctx.redirect('/');
  }

  /**
   * Looks houses record by submitted email, saves house random SHA1 hash.
   * If house is authorized. Show error message.
   *
   * If no house found send status 401.
   *
   * When house saved successfully, send message (publich event?) to house with
   * Reset password end-point url like: http://reactwebmedia.co/resetpasswordfrom?code={generatedcode}
   */
  async resetPassword(ctx, next) {

    if (ctx.request.session && ctx.request.session.house) {
      ctx.status = 403;
      ctx.body = {error: 'Please use profile change password feature.'};
      return;
    }

    for (let fieldName of ['email']) {
      if (!(fieldName in ctx.request.body)) {
        ctx.status = 400;
        ctx.body = {error: 'Bad Request'};
        return;
      }
    }

    let House = this.bookshelf.model('House');

    let house;

    try {
      house = await new House({email: ctx.request.body.email}).fetch({require: true});
    } catch (e) {
      // we do not show any error if we do not have house.
      // To prevent disclosure information about registered emails.
      ctx.status = 200;
      ctx.body = {success: true};
      return;
    }

    let random = Math.random().toString();
    let sha1 = crypto.createHash('sha1').update(house.email + random).digest('hex');

    if (!house.get('reset_password_hash')) {
      house.set('reset_password_hash', sha1);
      await house.save(null, {method: 'update'});
    }

    createJob('reset-password-email', {
      house_name: house.get('house_name'),
      email: ctx.request.body.email,
      hash: house.get('reset_password_hash')
    });

    ctx.status = 200;
    ctx.body = {success: true};
  }

  /**
   * New password form action.
   * Validates new password form with password/password repeat values.
   * Saves new password to House model.
   */
  async newPassword(ctx, next) {

    if (ctx.request.session && ctx.request.session.house) {
      ctx.redirect('/');
    }

    let House = this.bookshelf.model('House');

    let house;

    try {
      house = await new House({reset_password_hash: ctx.request.params.hash}).fetch({require: true});
    } catch (e) {
      console.warn('Someone tried to reset password using unknown reset-hash');  // eslint-disable-line no-console
      ctx.status = 401;
      ctx.body = {success: false};
      return;
    }

    if (!('password' in ctx.request.body) || !('password_repeat' in ctx.request.body)) {
      ctx.status = 400;
      ctx.body = {error: '"password" or "password_repeat" parameter is not provided'};
      return;
    }

    if (ctx.request.body.password !== ctx.request.body.password_repeat) {
      ctx.status = 400;
      ctx.body = {error: '"password" and "password_repeat" do not exact match.'};
      return;
    }

    let hashedPassword = await bcryptAsync.hashAsync(ctx.request.body.password, 10);

    house.set('hashed_password', hashedPassword);
    house.set('reset_password_hash', '');

    await house.save(null, {method: 'update'});
    ctx.body = {success: true};

  }

  async logout(ctx, next) {
    if (ctx.request.session && ctx.request.session.house) {
      ctx.request.session.destroy();
    }
    ctx.redirect('/');
  }

  async getHouse(ctx, next) {
    let House = this.bookshelf.model('House');
    let u = await House
      .where({house_name: ctx.request.params.house_name})
      .fetch({
        require: true
      });

    ctx.body = u.toJSON();
  }

  async updateHouse(ctx, next) {
    if (!ctx.request.session || !ctx.request.session.house) {
      ctx.status = 403;
      ctx.body = {error: 'You are not authorized'};
      return;
    }

    let House = this.bookshelf.model('House');

    try {
      let house = await House.where({id: ctx.request.session.house}).fetch({require: true});

      if(!_.isEmpty(ctx.request.body.more)) {
        let properties = _.extend(house.get('more'), ctx.request.body.more);
        house.set('more', properties);
      }

      await house.save(null, {method: 'update'});

      ctx.body = {house};
    } catch(e) {
      ctx.status = 500;
      ctx.body = {error: 'Update failed'};
      return;
    }
  }

  async changePassword(ctx, next) {
    if (!ctx.request.session || !ctx.request.session.house) {
      ctx.status = 403;
      ctx.body = {error: 'You are not authorized'};
      return;
    }

    if (!('old_password' in ctx.request.body) || !('new_password' in ctx.request.body)) {
      ctx.status = 400;
      ctx.body = {error: '"old_password" or "new_password" parameter is not provided'};
      return;
    }

    let House = this.bookshelf.model('House');

    try {
      let house = await House.where({id: ctx.request.session.house}).fetch({require: true});

      let passwordIsValid = await bcryptAsync.compareAsync(ctx.request.body.old_password, house.get('hashed_password'));

      if (!passwordIsValid) {
        ctx.status = 401;
        ctx.body = {error: 'old password is incorrect'};
        return
      }

      let hashedPassword = await bcryptAsync.hashAsync(ctx.request.body.new_password, 10);

      house.set('hashed_password', hashedPassword);

      await house.save(null, {method: 'update'});

      ctx.body = {success: true};
    } catch(e) {
      ctx.status = 500;
      ctx.body = {error: 'Update failed'};
      return;
    }
  }
}
