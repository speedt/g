-- huangxin <3203317@qq.com>

local db         = KEYS[1];
local server_id  = KEYS[2];
local channel_id = KEYS[3];
local card_type  = KEYS[4];

redis.call('SELECT', db);

-- 

local user_id = redis.call('GET', server_id ..'::'.. channel_id);

if (false == user_id) then return; end;

-- 

local card_type_val = redis.call('HGET', 'cfg', 'card_type_'.. card_type);

local gift_count = redis.call('HGET', 'prop::user::'.. user_id, 'gift_count');

gift_count = tonumber(gift_count) - tonumber(card_type_val);

if (0 > gift_count) then return; end;

-- 

redis.call('HSET', 'prop::user::'.. user_id, 'gift_count', gift_count);

return user_id;
