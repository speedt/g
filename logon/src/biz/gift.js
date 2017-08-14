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

(() => {
  var sql = 'SELECT a.*, b.user_name FROM (SELECT * FROM w_exchange) a LEFT JOIN s_manager b ON (a.user_id=b.id) WHERE b.id IS NOT NULL ORDER BY a.create_time DESC';

  exports.findAll = function(cb){
    mysql.query(sql, null, (err, docs) => {
      if(err) return cb(err);
      cb(null, docs);
    });
  };
})();

(() => {
  const sql = 'INSERT INTO w_exchange (id, mobile, addr, create_time, user_id, status, card_type_id, linkman) values (?, ?, ?, ?, ?, ?, ?, ?)';

  /**
   *
   * @return
   */
  exports.saveNew = function(newInfo, cb){

    var postData = [
      utils.replaceAll(uuid.v1(), '-', ''),
      newInfo.mobile,
      newInfo.addr,
      new Date(),
      newInfo.user_id,
      0,
      newInfo.card_type_id,
      newInfo.linkman,
    ];

    mysql.query(sql, postData, function (err, status){
      if(err) return cb(err);
      cb(null, status);
    });
  };
})();

(() => {
  const sql = 'UPDATE w_exchange SET status=1 WHERE id=?';

  /**
   *
   * @return
   */
  exports.editInfo = function(newInfo, cb){

    var postData = [
      newInfo.id
    ];

    mysql.query(sql, postData, function (err, status){
      if(err) return cb(err);
      cb(null, status);
    });
  };
})();

(() => {
  var sql = 'SELECT a.* FROM w_exchange a WHERE a.id=?';

  /**
   *
   * @return
   */
  exports.getById = function(id, cb){
    mysql.query(sql, [id], (err, docs) => {
      if(err) return cb(err);
      cb(null, mysql.checkOnly(docs) ? docs[0] : null);
    });
  };
})();
