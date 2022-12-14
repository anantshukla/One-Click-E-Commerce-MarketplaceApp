const express = require("express");
const productRouter = express.Router();

// Used to access Product Images
var path = require("path");

// Used to call the APIs
const axios = require("axios");

// Constants
const { productImagesLocation } = require("../commonUtils/constants");

const { successAPIResponse, failureAPIResponse } = require("../commonUtils/responseInterface");
const { getCurrentTimeInISO, downloadImageFromUrl } = require("../commonUtils/commonUtilityFunctions");

const db = require("../DB/db").getSqliteDatabaseConnection();
const logger = require("../commonUtils/logger");

// API that reads the public API and inserts data to our inventory - https://fakestoreapi.com/
productRouter.post("/addProductsToCatalog", async (req, res) => {
	try {
		const APILink = "https://fakestoreapi.com/products?limit=20";
		const responseFromGetProducts = (await axios.get(APILink)).data;

		for await (const eachProduct of responseFromGetProducts) {
			let currentTime = getCurrentTimeInISO();
			let { title, price, description, category, image } = eachProduct;
			category = category.replace(/['‘’"“”]/g, "");
			title = title.replace(/['‘’"“”]/g, "");
			description = description.replace(/['‘’"“”]/g, "");

			let categoryIdArr = await db.raw(`SELECT id FROM CATEGORIES c WHERE c.name = ?`, [category]);
			let categoryId;

			if (categoryIdArr.length != 0) {
				categoryId = categoryIdArr[0].id;
			} else {
				// Insert Category
				let categoryIdArr = await db.raw(
					`INSERT INTO CATEGORIES(name, created_by, created_on) VALUES (?, ?, ?) RETURNING id;`,
					[category, "System", currentTime]
				);
				categoryId = categoryIdArr[0].id;
			}

			let productIdInserted = await db.raw(
				`INSERT INTO PRODUCTS(name, description, price, category_id, created_on, created_by) VALUES (?, ?, ?, ?, ?, ?) RETURNING id;`,
				[title, description, price, categoryId, currentTime, "System"]
			);
			productIdInserted = productIdInserted[0].id;

			const fileExtension = image.split(".").pop();
			let imageName = `${productIdInserted}.${fileExtension}`;
			let imagePath = `./${productImagesLocation}/${productIdInserted}.${fileExtension}`;
			// Downloads the File into the Storage of Server
			await downloadImageFromUrl(image, `${imagePath}`);

			await db.raw(`UPDATE PRODUCTS SET image_path=? WHERE id=?;`, [imageName, productIdInserted]);
		}

		successAPIResponse(req, res, "Products added successfully");
		logger.createLog("Products added successfully");
	} catch (ex) {
		failureAPIResponse(req, res, "Failure in creating advertisement");
		logger.createExceptionLog(ex);
	}
});

productRouter.get("/getAllProductCategories", async (req, res) => {
	try {
		// Query that gets list of all the Categories from the db
		let categoriesList = await db.raw(`
        SELECT id, name
        FROM CATEGORIES c
    `);

		// Converting array of single element to a json named categoriesDetails
		let categoriesDetails = {};
		categoriesDetails["productCategories"] = categoriesList;

		successAPIResponse(req, res, categoriesDetails);
		logger.createLog(`Product Categories Fetched Successfully`);
	} catch (ex) {
		failureAPIResponse(req, res, "Failure to get Product Categories");
		logger.createExceptionLog(ex);
	}
});

productRouter.post("/getAllProducts", async (req, res) => {
	try {
		let productList = await db.raw(
			`SELECT p.id as productId,
                p.name as productName,
                p.description as productDescription,
                p.price,
                p.image_path as imageName,
                c.name as categoryName
        FROM PRODUCTS AS p
        LEFT JOIN CATEGORIES as c
            ON c.id = p.category_id;
    `
		);

		// Converting array of single element to a json named allProducts
		let allProducts = {};
		allProducts["products"] = productList;

		successAPIResponse(req, res, allProducts);
		logger.createLog(`Product Details Fetched Successfully`);
	} catch (ex) {
		failureAPIResponse(req, res, "Failure to get Product List");
		logger.createExceptionLog(ex);
	}
});

productRouter.post("/getProductDetails", async (req, res) => {
	try {
		let productId = req.body.productId ? req.body.productId : 0;

		// Get details of a particular product id from the product table
		let productDetailsResponse = await db.raw(
			`SELECT p.id as productId,
                p.name as productName,
                p.description as productDescription,
                p.price,
                p.image_path as imageName,
                c.name as categoryName
			FROM PRODUCTS AS p
			LEFT JOIN CATEGORIES as c
				ON c.id = p.category_id
			WHERE p.id = ?;
    		`,
			[productId]
		);
		if (productDetailsResponse.length === 0) {
			throw "No elements found";
		}
		// Converting array of single element to a json named advertisementDetails
		let productDetails = {};
		productDetails["advertisementDetails"] = productDetailsResponse[0];
		successAPIResponse(req, res, productDetails);
		logger.createLog(`Product Details Fetched Successfully`);
	} catch (ex) {
		failureAPIResponse(req, res, "Failure to get Product Details");
		logger.createExceptionLog(ex);
	}
});

productRouter.get("/getProductImage/:imageName", async (req, res) => {
	try {
		let imageName = req.params.imageName;

		var httpOptions = {
			root: path.join(__rootdir + `/${productImagesLocation}/`),
		};

		productId = req.params.productId;
		res.sendFile(imageName, httpOptions, function (err) {
			if (err) {
				failureAPIResponse(req, res, "Image Not Found", 404);
				logger.createExceptionLog(err);
			} else {
				logger.createLog(`Image Sent: ${imageName}`);
			}
		});
	} catch (ex) {
		failureAPIResponse(req, res, "Failure to get Image");
		logger.createExceptionLog(ex);
	}
});

module.exports = productRouter;
