-- Table for Storing User Details
CREATE TABLE USERS (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	email TEXT NOT NULL UNIQUE,
	password TEXT NOT NULL,
	first_name TEXT NOT NULL,
	last_name TEXT NOT NULL,
	phone TEXT NOT NULL UNIQUE,
	
	-- For Audit Trailing	
	created_on DATETIME,
	created_by TEXT,
	modified_on DATETIME,
	modified_by TEXT
);

-- Table for Storing Product Inventory Details
CREATE TABLE INVENTORY (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	quantity INTEGER,

	-- For Audit Trailing	
	created_on DATETIME,
	created_by TEXT,
	modified_on DATETIME,
	modified_by TEXT
);

-- Table for Storing Product Category Details
CREATE TABLE CATEGORIES(
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT,	

	-- For Audit Trailing	
	created_on DATETIME,
	created_by TEXT,
	modified_on DATETIME,
	modified_by TEXT
);


-- Table for Storing Product Details
CREATE TABLE PRODUCTS (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL,
	description TEXT,
	price DECIMAL(10,5) NOT NULL,
	inventory_id INTEGER,
	category_id INTEGER,
	-- For Audit Trailing	
	created_on DATETIME,
	created_by TEXT,
	modified_on DATETIME,
	modified_by TEXT,
	
	CONSTRAINT products_inventory_fk FOREIGN KEY (inventory_id) REFERENCES INVENTORY(id),
	CONSTRAINT products_catogory_fk FOREIGN KEY (category_id) REFERENCES CATEGORIES(id)
);