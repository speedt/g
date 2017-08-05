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
const user_purchase = require('./user_purchase');
const goods = require('./goods');

(() => {

  function step1(payInfo, conn, resolve, reject){
    user.updatePurchase(payInfo.user_id, payInfo.amount, function (err, status){
      if(err) return reject(err);
      if(0 === status.changedRows) return reject('10');
      resolve();
    }, conn);
  }

  function step2(payInfo, conn, resolve, reject){
    payInfo.goods_id = payInfo.product_id;

    user_purchase.saveNew(payInfo, function (err, doc){
      if(err) return reject(err);
      resolve(doc);
    }, conn);
  }

  function step3(payInfo, conn, resolve, reject){

    user.updateVip(payInfo.user_id, function (err, status){
      if(err) return reject(err);
      resolve();
    }, conn);
  }

  function step4(payInfo, conn, resolve, reject){

    goods.getById(payInfo.goods_id, function (err, doc){
      if(err) return reject(err);
      if(!doc) return reject('11');
      resolve(doc);
    }, conn);
  }

  function step5(payInfo, conn, goods_info, resolve, reject){

    user.updatePaymentToCache(payInfo.goods_id, function (err, doc){
      if(err) return reject(err);
      resolve(doc);
    }, conn);
  }

  var private_key  = 'E2D5511AFC845DDF8CE220ACE2A0A1C9';
  var enhanced_key = 'OWE2ZmMyOGVmMWNhYzc0MmYyOWU';

  function validate(payInfo){
    return true;
  }

  exports.notice = function(payInfo, cb){
    if(!validate(payInfo)) return cb(null, '01');

    // ------------------------------------------------------

    payInfo.user_id = payInfo.user_id || '';

    if(!_.isString(payInfo.user_id)) return cb(null, '02');

    payInfo.user_id = payInfo.user_id.trim();

    if(_.isEmpty(payInfo.user_id)) return cb(null, '03');

    logger.trace('notice param user_id: %s', id);

    // ------------------------------------------------------

    payInfo.amount = payInfo.amount || 0;

    if(!_.isNumber(payInfo.amount)) return cb(null, '04');

    logger.trace('notice param amount: %s', payInfo.amount);

    if(!(0 < payInfo.amount)) return cb(null, '05');

    // ------------------------------------------------------

    payInfo.product_id = payInfo.product_id || '';

    if(!_.isString(payInfo.product_id)) return cb(null, '06');

    payInfo.product_id = payInfo.product_id.trim();

    if(_.isEmpty(payInfo.product_id)) return cb(null, '07');

    logger.trace('notice param product_id: %s', id);

    // ------------------------------------------------------

    payInfo.order_id = payInfo.order_id || '';

    if(!_.isString(payInfo.order_id)) return cb(null, '08');

    payInfo.order_id = payInfo.order_id.trim();

    if(_.isEmpty(payInfo.order_id)) return cb(null, '09');

    logger.trace('notice param order_id: %s', id);

    // ------------------------------------------------------

    mysql.getPool().getConnection((err, conn) => {
      if(err) return cb(err);

      conn.beginTransaction(function (err){
        if(err) return cb(err);

        new Promise(step1.bind(null, payInfo, conn)).then(function(){
          return new Promise(step2.bind(null, payInfo, conn));
        }).then(function (order_info){
          return new Promise(step3.bind(null, payInfo, conn));
        }).then(function(){
          return new Promise(step4.bind(null, payInfo, conn));
        }).then(function (goods_info){
          return new Promise(step5.bind(null, payInfo, conn, goods_info));
        }).catch(err => {
          conn.rollback(function(){
            if('object' === typeof err) return cb(err);
            cb(null, err);
          });
        });

      });
    });







    // user.updatePurchase(payInfo.user_id, payInfo.amount, function (err, status){
    //   if(err) return cb(err);
    //   if(0 === status.changedRows) return;

    //   user_purchase.saveNew({ goods_id: payInfo.product_id, user_id: payInfo.user_id }, function (err, status){
    //     if(err) return cb(err);

    //     user.updateVip(payInfo.user_id, function (err, status){
    //       if(err) return cb(err);

    //       user.getById(payInfo.user_id, function (err, doc){
    //         if(err) return cb(err);
    //         cb(null, doc);
    //       });
    //     });

    //   });

    // });

  };
})();
