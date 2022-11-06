CREATE TABLE USERS (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	email TEXT NOT NULL UNIQUE,
	password TEXT NOT NULL,
	first_name TEXT NOT NULL,
	last_name TEXT NOT NULL,
	phone TEXT NOT NULL UNIQUE
);


CREATE TABLE ADVERTISEMENTS (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	advertisement_name TEXT NOT NULL,
	description TEXT,
	price DECIMAL(10,5) NOT NULL,
	location TEXT,
	advertisement_status BOOLEAN DEFAULT 1 NOT NULL, --0 inactive, 1 active
	seller_id INTEGER,
	categories TEXT,
	CONSTRAINT advertisement_user_sellerid FOREIGN KEY (seller_id) REFERENCES USERS(id)
);