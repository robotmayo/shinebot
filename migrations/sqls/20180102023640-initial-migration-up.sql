/* UP */

CREATE SCHEMA IF NOT EXISTS shinebot;

CREATE TABLE shinebot.users (
    id VARCHAR(128) PRIMARY KEY, -- Discord User Snowflake
    added_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP::TIMESTAMPZ,
    modified_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP::TIMESTAMPZ,
    last_daily TIMESTAMP,
    shines INT NOT NULL,
    can_bet BOOLEAN DEFAULT TRUE
);

CREATE TABLE shinebot.bot_log(
    id VARCHAR(128) PRIMARY KEY, -- Discord message snowflake
    user_message TEXT,
    bot_message TEXT,
    added_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP::TIMESTAMPZ,
    user_id VARCHAR(128)
);

CREATE TABLE shinebot.shine_transaction_log(
    id BIGSERIAL PRIMARY KEY
);
