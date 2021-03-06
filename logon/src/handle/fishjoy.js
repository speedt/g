/*!
 * emag.handle
 * Copyright(c) 2016 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

const biz    = require('emag.biz');
const cfg    = require('emag.cfg');

const log4js = require('log4js');
const logger = log4js.getLogger('handle');

const _ = require('underscore');

/**
 *
 */
function _ready_ready(send, server_id, channel_id, seq_id, err, doc){
  if(err) return logger.error('fishjoy ready:', err);

  if(_.isArray(doc)){

    var arr1 = doc[0];
    if(!arr1) return;

    var result = {
      timestamp: new Date().getTime(),
      method:    5006,
      seqId:     seq_id,
      data:      doc[1],
    };

    return ((function(){

      for(let i=0, j=arr1.length; i<j; i++){
        let s           = arr1[i];
        result.receiver = arr1[++i];

        if(!s)               continue;
        if(!result.receiver) continue;

        send('/queue/back.send.v2.'+ s, { priority: 9 }, result, () => {});
      }
    })());
  }

  switch(doc){
    case 'invalid_user_id':
      return send('/queue/front.force.v2.'+ server_id, { priority: 9 }, channel_id, () => {});
    default: break;
  }
}

/**
 *
 */
function _ready_refresh(send, seq_id, err, doc){
  if(err) return logger.error('fishjoy refresh:', err);

  if(!_.isArray(doc)) return;

  var arr1 = doc[0];
  if(!arr1) return;

  var result = {
    timestamp: new Date().getTime(),
    method:    5008,
    seqId:     seq_id,
    data:      doc[1],
  };

  for(let i=0, j=arr1.length; i<j; i++){
    let s           = arr1[i];
    result.receiver = arr1[++i];

    if(!s)               continue;
    if(!result.receiver) continue;

    send('/queue/back.send.v2.'+ s, { priority: 9 }, result, () => {});
  }
}

/**
 *
 */
function _ready_scene(send, seq_id, err, doc){
  if(err) return logger.error('fishjoy scene:', err);

  if(!_.isArray(doc)) return;

  var arr1 = doc;

  var result = {
    timestamp: new Date().getTime(),
    method:    5010,
    seqId:     seq_id,
  };

  for(let i=0, j=arr1.length; i<j; i++){
    let s           = arr1[i];
    result.receiver = arr1[++i];

    if(!s)               continue;
    if(!result.receiver) continue;

    send('/queue/back.send.v2.'+ s, { priority: 9 }, result, () => {});
  }
}

/**
 *
 */
function _ready_unfreeze(send, seq_id, err, doc){
  if(err) return logger.error('fishjoy unfreeze:', err);

  if(!_.isArray(doc)) return;

  var arr1 = doc;

  var result = {
    timestamp: new Date().getTime(),
    method:    5016,
    seqId:     seq_id,
    data:      doc[1],
  };

  for(let i=0, j=arr1.length; i<j; i++){
    let s           = arr1[i];
    result.receiver = arr1[++i];

    if(!s)               continue;
    if(!result.receiver) continue;

    send('/queue/back.send.v2.'+ s, { priority: 9 }, result, () => {});
  }
}

/**
 *
 */
exports.ready = function(send, msg){
  if(!_.isString(msg.body)) return logger.error('fishjoy ready empty');

  try{ var data = JSON.parse(msg.body);
  }catch(ex){ return; }

  biz.fishjoy.ready(data.serverId, data.channelId,
       _ready_ready.bind(null, send, data.serverId, data.channelId, data.seqId),
     _ready_refresh.bind(null, send, data.seqId),
       _ready_scene.bind(null, send, data.seqId),
    _ready_unfreeze.bind(null, send, data.seqId));
};

/**
 *
 */
exports.switch = function(send, msg){
  if(!_.isString(msg.body)) return logger.error('fishjoy switch empty');

  try{ var data = JSON.parse(msg.body);
  }catch(ex){ return; }

  try{ var ss = JSON.parse(data.data);
  }catch(ex){ return; }

  biz.fishjoy.switch(data.serverId, data.channelId, ss.level, function (err, doc){
    if(err) return logger.error('fishjoy switch:', err);

    if(_.isArray(doc)){

      var arr1 = doc[0];
      if(!arr1) return;

      var result = {
        method: 5014,
        seqId:  data.seqId,
        data:   [doc[1], ss.style],
      };

      return ((function(){

        for(let i=0, j=arr1.length; i<j; i++){
          let s           = arr1[i];
          result.receiver = arr1[++i];

          if(!s)               continue;
          if(!result.receiver) continue;

          send('/queue/back.send.v2.'+ s, { priority: 9 }, result, () => {});
        }
      })());
    }

    switch(doc){
      case 'invalid_user_id':
        return send('/queue/front.force.v2.'+ data.serverId, { priority: 9 }, data.channelId, () => {});
    }
  });
};

/**
 *
 */
exports.shot = function(send, msg){
  if(!_.isString(msg.body)) return logger.error('fishjoy shot empty');

  try{ var data = JSON.parse(msg.body);
  }catch(ex){ return; }

  biz.fishjoy.shot(data.serverId, data.channelId, data.data, function (err, doc){
    if(err) return logger.error('fishjoy shot:', err);

    if(_.isArray(doc)){

      var arr1 = doc[0];
      if(!arr1) return;

      var result = {
        timestamp: new Date().getTime(),
        method:    5002,
        seqId:     data.seqId,
        data:      doc[1],
      };

      return ((function(){

        for(let i=0, j=arr1.length; i<j; i++){
          let s           = arr1[i];
          result.receiver = arr1[++i];

          if(!s)               continue;
          if(!result.receiver) continue;

          send('/queue/back.send.v2.'+ s, { priority: 9 }, result, () => {});
        }
      })());
    }

    switch(doc){
      case 'invalid_user_id':
        return send('/queue/front.force.v2.'+ data.serverId, { priority: 9 }, data.channelId, () => {});
    }
  });
};

/**
 *
 */
exports.blast = function(send, msg){
  if(!_.isString(msg.body)) return logger.error('fishjoy blast empty');

  try{ var data = JSON.parse(msg.body);
  }catch(ex){ return; }

  biz.fishjoy.blast(data.serverId, data.channelId, data.data, function (err, doc){
    if(err) return logger.error('fishjoy blast:', err);

    if(_.isArray(doc)){

      var arr1 = doc[0];
      if(!arr1) return;

      var result = {
        timestamp: new Date().getTime(),
        method:    5004,
        seqId:     data.seqId,
        data:      doc[1],
      };

      return ((function(){

        for(let i=0, j=arr1.length; i<j; i++){
          let s           = arr1[i];
          result.receiver = arr1[++i];

          if(!s)               continue;
          if(!result.receiver) continue;

          send('/queue/back.send.v2.'+ s, { priority: 9 }, result, () => {});
        }

        // notify all
        if(!(result.data[5])) return;

        biz.frontend.findAll(function (err, docs){
          if(err) return logger.error('frontend findAll:', err);
          if(!docs) return;
          if(0 === docs.length) return;

          var data = JSON.stringify({
            method:   1010,
            receiver: 'ALL',
            data:     result.data
          });

          for(let i of docs){
            send('/queue/back.send.v2.'+ i, { priority: 8 }, data, () => {});
          }
        });

      })());
    }

    switch(doc){
      case 'invalid_user_id':
        return send('/queue/front.force.v2.'+ data.serverId, { priority: 9 }, data.channelId, () => {});
    }
  });
};

/**
 *
 */
exports.tool = function(send, msg){
  if(!_.isString(msg.body)) return logger.error('fishjoy tool empty');

  try{ var data = JSON.parse(msg.body);
  }catch(ex){ return; }

  biz.fishjoy.tool(data.serverId, data.channelId, data.data, function (err, doc){
    if(err) return logger.error('fishjoy tool:', err);

    if(_.isArray(doc)){

      var arr1 = doc[0];
      if(!arr1) return;

      var result = {
        timestamp: new Date().getTime(),
        method:    5012,
        seqId:     data.seqId,
        data:      doc[1],
      };

      return ((function(){

        for(let i=0, j=arr1.length; i<j; i++){
          let s           = arr1[i];
          result.receiver = arr1[++i];

          if(!s)               continue;
          if(!result.receiver) continue;

          send('/queue/back.send.v2.'+ s, { priority: 9 }, result, () => {});
        }
      })());
    }

    switch(doc){
      case 'invalid_user_id':
        return send('/queue/front.force.v2.'+ data.serverId, { priority: 9 }, data.channelId, () => {});
    }
  });
};

/**
 *
 */
exports.exchange = function(send, msg){
  if(!_.isString(msg.body)) return logger.error('fishjoy exchange empty');

  try{ var data = JSON.parse(msg.body);
  }catch(ex){ return; }

  try{ var gift = JSON.parse(data.data);
  }catch(ex){ return; }

  biz.fishjoy.exchange(data.serverId, data.channelId, gift, function (err, code){
    if(err) return logger.error('fishjoy exchange:', err);

    var result = {
      timestamp: new Date().getTime(),
      method:    5022,
      seqId:     data.seqId,
      receiver:  data.channelId,
      data:     'Wrong'
    };

    if(code){
      send('/queue/back.send.v2.'+ data.serverId, { priority: 9 }, result, () => {});
      return;
    }

    result.data = 'OK';

    send('/queue/back.send.v2.'+ data.serverId, { priority: 9 }, result, () => {});
  })
};
