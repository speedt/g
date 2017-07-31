/*!
 * emag.login
 * Copyright(c) 2016 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

const URL = require('url');

const conf = require('../settings');
const utils = require('speedt-utils').utils;

const biz = require('emag.biz');

exports.indexUI = function(req, res, next){

  biz.cfg.findAll(1, function (err, docs){

    res.render('settings/index', {
      conf: conf,
      data: {
        list_cfg:     docs,
        session_user: req.session.user,
        nav_choose:   ',02,0201,'
      }
    });
  });
};

exports.edit = function(req, res, next){
  var query = req.body;

  biz.cfg.editInfo(query, (err, status) => {
    if(err) return next(err);
    res.send({});
  });
};

exports.bullet = function(req, res, next){

  var p1 = new Promise((resolve, reject) => {

    biz.cfg.findByType('bullet_consume', function (err, docs){
      if(err) return reject(err);
      resolve(docs);
    });
  });

  var p2 = new Promise((resolve, reject) => {

    biz.cfg.findByType('bullet_range', function (err, docs){
      if(err) return reject(err);
      resolve(docs);
    });
  });

  var p3 = new Promise((resolve, reject) => {

    biz.cfg.findByType('bullet_style', function (err, docs){
      if(err) return reject(err);
      resolve(docs);
    });
  });

  Promise.all([p1, p2, p3]).then(values => {
    var bullet_consume = values[0].data;
    var bullet_range   = values[1].data;
    var bullet_style   = values[2].data;

    res.send([bullet_consume, bullet_range, bullet_style]);
  }).catch(next);
};