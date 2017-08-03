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

const md5 = require('speedt-utils').md5;
const utils = require('speedt-utils').utils;

const mysql = require('emag.db').mysql;
const redis = require('emag.db').redis;

const cfg = require('emag.cfg');

const _ = require('underscore');

(() => {
  var sql = 'SELECT b.user_name, c.goods_name, a.* FROM (SELECT * FROM s_user_purchase WHERE user_id=?) a LEFT JOIN s_user b ON (a.user_id=b.id) LEFT JOIN w_goods c ON (a.goods_id=c.id) WHERE b.id IS NOT NULL AND c.id IS NOT NULL ORDER BY a.create_time DESC';

  /**
   * 用户消费记录
   */
  exports.findAllByUserId = function(user_id, cb){
    mysql.query(sql, [user_id], (err, docs) => {
      if(err) return cb(err);
      cb(null, docs);
    });
  };
})();
