const app = require("../app");
const request = require("supertest");

describe("Product Controller", () => {
	describe("/addProductsToCatalog", () => {
		it("/addProductsToCatalog should add products to the catalog", async () => {
			const res = await request(app).post(`/addProductsToCatalog`);
			expect(res.status).toEqual(200);
		}, 30000);
	});

	describe("/getAllProducts", () => {
		it("/getAllProducts should return list of all products available in the catalog", async () => {
			const res = await request(app).post(`/getAllProducts`);
			expect(res.status).toEqual(200);
			expect(res.body.statusCode).toEqual(1);
			expect(res.body.message.products).toBeInstanceOf(Array);
			res.body.message.products.forEach((productList) => {
				expect(productList).toMatchObject({
					productId: expect.any(Number),
					productName: expect.any(String),
					productDescription: expect.any(String),
					price: expect.any(Number),
					categoryName: expect.any(String),
				});
			});
		});
	});

	describe("/getProductDetails", () => {
		it("/getProductDetails should get product details of a particular product in the catalog", async () => {
			const res = await request(app).post(`/getProductDetails`).send({
				productId: 1,
			});
			expect(res.status).toEqual(200);
			expect(res.body.statusCode).toEqual(1);

			const { productId, productName, productDescription, price, imageURL, categoryName } =
				res.body.message.advertisementDetails;

			expect(productId).toEqual(expect.any(Number));
			expect(productName).toEqual(expect.any(String));
			expect(productDescription).toEqual(expect.any(String));
			expect(price).toEqual(expect.any(Number));
			expect(imageURL).toEqual(expect.any(String));
			expect(categoryName).toEqual(expect.any(String));
		});

		it("/getProductDetails should throw error as incorrect productId is provided", async () => {
			const res = await request(app).post(`/getProductDetails`).send({
				productId: -1,
			});
			expect(res.status).toEqual(400);
			expect(res.body.statusCode).toEqual(0);
		});
	});

	describe("/getAllProductCategories", () => {
		it("/getAllProductCategories should get all product categories", async () => {
			const res = await request(app).get(`/getAllProductCategories`);
			expect(res.status).toEqual(200);
			expect(res.body.statusCode).toEqual(1);

			expect(res.body.message.productCategories).toBeInstanceOf(Array);
			res.body.message.productCategories.forEach((category) => {
				expect(category).toMatchObject({
					id: expect.any(Number),
					name: expect.any(String),
				});
			});
		});
	});

	describe("/getProductImage", () => {
		it("/getProductImage should get product image", async () => {
			const res = await request(app).post(`/getProductImage`).send({
				imageURL: "assets/images/4.jpg",
			});
			expect(res.status).toEqual(200);
		});
	});
});
