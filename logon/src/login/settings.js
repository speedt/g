/*!
 * emag.login
 * Copyright(c) 2016 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

module.exports = {
  app: {
    resHost: '127.0.0.1'
  },
  corp: {
    name: 'foreworld.net',
  },
  cookie: {
    key: 'backend',
    secret: 'login'
  },
  html: {
    virtualPath: '/client/',
    cdn: 'http://www.foreworld.net/'
  },
  activemq: {
    host: process.env.ACTIVEMQ_HOST || '127.0.0.1',
    port: process.env.ACTIVEMQ_PORT || 12613,
    user: 'admin',
    password: 'admin',
  },
  mysql: {
    database: 'emag',
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: process.env.MYSQL_PORT || 12306,
    user: 'root',
    password: process.env.MYSQL_PASS || 'password',
    connectionLimit: 50
  },
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 12379,
    password: '123456',
    database: 1
  }
};
