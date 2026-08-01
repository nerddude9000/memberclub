-- NOTE: we could have used a boolean, but this enables adding other statuses easily,
-- such as: member+, member++, member_extra_premium_money_milking_tier
CREATE TYPE membership_status AS ENUM ('none', 'member');

CREATE TABLE users (
	id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	firstname VARCHAR (64),
	lastname VARCHAR (64),
	email VARCHAR (256),
	password VARCHAR (64),
	membership membership_status
);

CREATE TABLE messages (
	id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	user_id INTEGER references users(id),
	title VARCHAR (96),
	content VARCHAR (1024),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

