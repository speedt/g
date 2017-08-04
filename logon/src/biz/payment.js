/*!
 * emag.biz
 * Copyright(c) 2016 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

const path = require('path');
const cwd = process.cwd();

const conf = require(path.join(cwd, 'settings'));

const EventProxy = require('eventproxy');
const uuid = require('node-uuid');

const utils = require('speedt-utils').utils;

const mysql = require('emag.db').mysql;
const redis = require('emag.db').redis;

const _ = require('underscore');

const user = require('./user');

(() => {

  var private_key  = 'E2D5511AFC845DDF8CE220ACE2A0A1C9';
  var enhanced_key = 'OWE2ZmMyOGVmMWNhYzc0MmYyOWU';

  function validate(payInfo){
    return true;
  }

  exports.notice = function(payInfo, cb){
    if(!validate(payInfo)) return;

    user.getById(payInfo.user_id, function (err, doc){
      if(err) return cb(err);
      if(!doc) return;
    });

  };
})();
