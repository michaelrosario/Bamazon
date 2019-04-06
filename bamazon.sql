DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products  (
	item_id INT NOT NULL AUTO_INCREMENT,
	product_name VARCHAR(200) NOT NULL,
	department_name VARCHAR(100) NOT NULL,
	price decimal(12, 2) NOT NULL,
	stock_quantity INT default 0,
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
		'Fluval Edge Aquarium with LED Light',
		'Pet Supplies',
		'149.99',
		'30'
	),
	(	
		'Drobo 5N2: Network Attached Storage (NAS) 5-Bay Array',
		'Computer Hardware',
		'454.99',
		'12'
	),
	(
		'Sony Alpha a9 Mirrorless Digital Camera [ILCE9/B]',
		'Mirrorless Cameras',
		'4498.00',
		'5'
	),
	(
		'GoPro HERO7 Black — Waterproof Digital Action Camera',
		'Compact Cameras',
		'380.40',
		'22'
	),
	(
		'Zebralight H53Fc AA Headlamp Floody Neutral White High CRI',
		'Headlamps',
		'59.00',
		'52'
	),
	(
		'Panasonic BK-3HCCE4BE Eneloop Pro AA High Capacity Ni-MH Pre-Charged Rechargeable Batteries (Pack of 4)',
		'Batteries',
		'20.72',
		'12'
	),
	(
		'Burton Amplifier Snowboard',
		'Snowboards',
		'359.96',
		'32'
	),
	(
		'Smittybilt Overlander Tent',
		'Camping',
		'730.54',
		'4'
	),
	(
		'TCL 55S405 55-Inch 4K Ultra HD Roku Smart LED TV (2017 Model)',
		'Televisions',
		'349.99',
		'11'
	);



