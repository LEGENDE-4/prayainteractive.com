create table if not exists leads (
  id char(36) primary key,
  audience enum('kids','seniors','cse'),
  company_or_org varchar(255), contact_name varchar(255), role_title varchar(255),
  email varchar(255), phone varchar(64), whatsapp varchar(64),
  country varchar(64), city varchar(64),
  consent_source varchar(255), consent_date date,
  language varchar(8) default 'fr',
  segment_tags text,
  website varchar(255), notes text,
  score int default 0,
  status varchar(32) default 'new',
  last_touch_at datetime, next_touch_at datetime,
  owner varchar(255),
  created_at datetime default current_timestamp
);
create table if not exists touch_logs (
  id char(36) primary key,
  lead_id char(36),
  channel enum('email','whatsapp'),
  variant varchar(2),
  sent_at datetime default current_timestamp,
  opened boolean, clicked boolean, replied boolean, unsubscribed boolean,
  meta json
);
create table if not exists templates_email (
  id char(36) primary key,
  audience varchar(32), variant varchar(2), subject varchar(255), preheader varchar(255),
  html_body mediumtext, text_body mediumtext, discount_code varchar(32), utm_campaign varchar(64)
);
create table if not exists templates_wa (
  id char(36) primary key,
  template_name varchar(128), language varchar(8), audience varchar(32), body_text text
);
