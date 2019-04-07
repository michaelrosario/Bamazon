DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products  (
	item_id INT NOT NULL AUTO_INCREMENT,
	product_name VARCHAR(200) NOT NULL,
	department_name VARCHAR(100) NOT NULL,
	price decimal(24, 2) NOT NULL,
	stock_quantity INT default 0,
	product_sales decimal(24, 2) default 0,
	PRIMARY KEY (item_id)
);

INSERT INTO products (
	product_name,
 	department_name,
 	price,
 	stock_quantity
) VALUES 
	(
		'Mens Leather Wallet Zipper RFID Blocking Wallets Coins Purse',
		'Accessories',
		'23.98',
		'50'
	),
	(
		'Rollerblade Twister Edge X Urban Inline Skates 2019',
		'Sports',
		'279.99',
		'30'
	),
	(	
		'Drobo 5N2: Network Attached Storage (NAS) 5-Bay Array',
		'Electronics',
		'454.99',
		'12'
	),
	(
		'Sony Alpha a9 Mirrorless Digital Camera [ILCE9/B]',
		'Electronics',
		'4498.00',
		'5'
	),
	(
		'GoPro HERO7 Black — Waterproof Digital Action Camera',
		'Electronics',
		'380.40',
		'22'
	),
	(
		'Zebralight H53Fc AA Headlamp Floody Neutral White High CRI',
		'Electronics',
		'59.00',
		'52'
	),
	(
		'Panasonic BK-3HCCE4BE Eneloop Pro AA High Capacity Ni-MH Pre-Charged Rechargeable Batteries (Pack of 4)',
		'Electronics',
		'20.72',
		'12'
	),
	(
		'Burton Amplifier Snowboard',
		'Sports',
		'359.96',
		'32'
	),
	(
		'Shimano Claris 24 Speed with Carbon Forks Road Bikes',
		'Sports',
		'499.99',
		'19'
	),
	(
		'TCL 55S405 55-Inch 4K Ultra HD Roku Smart LED TV (2017 Model)',
		'Electronics',
		'349.99',
		'11'
	),
	(
		'Untuckit Reversible Cotton & Leather Striped Belt',
		'Accessories',
		'59.99',
		'30'
	),
	(
		"Men's Lee Regular Fit Straight Leg Jeans",
		'Clothing',
		'59.99',
		'30'
	),
	(
		"Men's Apt. 9 Solid Tee",
		'Clothing',
		'9.99',
		'40'
	),
	(
		"Men's Croft & Barrow Classic-Fit Side-Elastic 7.5-inch Cargo Shorts",
		'Clothing',
		'17.99',
		'30'
	);




CREATE TABLE departments  (
	department_id INT NOT NULL AUTO_INCREMENT,
	department_name VARCHAR(200) NOT NULL,
	over_head_costs decimal(24, 2) NOT NULL,
	PRIMARY KEY (department_id)
);

INSERT INTO departments (
 	department_name,
 	over_head_costs
) VALUES 
	(
		'Accessories',
		'3000.00'
	),
	(
		'Electronics',
		'5000.00'
	),
	(
		'Sports',
		'4000.00'
	),
	(
		'Clothing',
		'6000.00'
	);