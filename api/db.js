import Knex from 'knex';
import Bookshelf from 'bookshelf';
import uuid from 'uuid'
import _ from 'lodash'
import bb from 'bluebird';
import bcrypt from 'bcrypt';
import crypto from 'crypto'


let bcryptAsync = bb.promisifyAll(bcrypt);

export default function initBookshelf(config) {
  let knex = Knex(config);
  let bookshelf = Bookshelf(knex);

  bookshelf.plugin('registry');
  bookshelf.plugin('visibility');
  bookshelf.plugin('virtuals');

  let User;

  User = bookshelf.Model.extend({
    tableName: 'users',
    hidden: ['hashed_password', 'email', 'check_hash', 'reset_password_hash'],
  });

  User.create = async function(house_name, password, email, phone) {
    let hashed_password = await bcryptAsync.hashAsync(password, 10);

    let random = Math.random().toString();
    let check_hash = crypto.createHash('sha1').update(email + random).digest('hex');

    let obj = new User({
      id: uuid.v4(),
      user_name,
      hashed_password,
      email,
      check_hash
    });

    await obj.save(null, {method: 'insert'});

    return obj;
  };

  bookshelf.model('User', User);

  return bookshelf;
}