const app = require("../app");
const request = require("supertest");

function randStrOfLen(len = 5, prefix = "Unit-Test") {
	let result = prefix + "_";
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const charactersLength = characters.length;
	for (var i = 0; i < len; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

function randIntofLen(len = 5) {
	let result = "";
	const integerValues = "0123456789";
	const integerLength = integerValues.length;
	for (var i = 0; i < len; i++) {
		result += integerValues.charAt(Math.floor(Math.random() * integerLength));
	}
	return result;
}

describe("Ping API", () => {
	describe("/", () => {
		it("/createUser should create new user", async () => {
			const res = await request(app).get(`/`);
			expect(res.status).toEqual(200);
			expect(res.body.statusCode).toEqual(1);
		});
	});
	describe("/createUser", () => {
		it("/createUser should create new user", async () => {
			const res = await request(app)
				.post(`/createUser`)
				.send({
					email: `${randStrOfLen(6, "test")}@gmail.com`,
					password: "test_password",
					firstName: `${(6, "First_")}`,
					lastName: `${(6, "Last_")}`,
					phoneNumber: `+1 ${randIntofLen(10)}`,
				});
			expect(res.body.message).toEqual("User Created successfully");
			expect(res.body.statusCode).toEqual(1);
			expect(res.status).toEqual(200);
		});
		it("/createUser should throw error as the email already exists", async () => {
			const res = await request(app).post(`/createUser`).send({
				email: "tim@gmail.com",
				password: "test_password",
				firstName: "Tim",
				lastName: "Tamara",
				phoneNumber: "+1 887 444 551155",
			});
			expect(res.status).toEqual(400);
		});
		it("/createUser should throw error as the phoneNumber already exists", async () => {
			const res = await request(app).post(`/createUser`).send({
				email: "tim111@gmail.com",
				password: "test_password",
				firstName: "Tim",
				lastName: "Tamara",
				phoneNumber: "+1 887 444 5555",
			});
			expect(res.status).toEqual(400);
		});
		it("/createUser should throw error as the email is empty", async () => {
			const res = await request(app).post(`/createUser`).send({
				email: "",
				password: "test_password",
				firstName: "Tim",
				lastName: "Tamara",
				phoneNumber: "+1 8887 444 5543555",
			});
			expect(res.status).toEqual(400);
		});
		it("/createUser should throw error as the email is null", async () => {
			const res = await request(app).post(`/createUser`).send({
				password: "test_password",
				firstName: "Tim",
				lastName: "Tamara",
				phoneNumber: "+1 8887 444 5543555",
			});
			expect(res.status).toEqual(400);
		});
	});

	describe("/authenticateUser", () => {
		it("/authenticateUser should authenticate the user", async () => {
			const res = await request(app).post(`/authenticateUser`).send({
				email: "san@gmail.com",
				password: "password",
			});
			expect(res.status).toEqual(200);
		});

		it("/authenticateUser should fail to authenticate as email is incorrect", async () => {
			const res = await request(app).post(`/authenticateUser`).send({
				email: "mail_that_doesntexist@gmail.com",
				password: "test_password",
			});
			expect(res.status).toEqual(401);
		});

		it("/authenticateUser should fail to authenticate as passoword is incorrect", async () => {
			const res = await request(app).post(`/authenticateUser`).send({
				email: "san@gmail.com",
				password: "IncorrectPassword",
			});
			expect(res.status).toEqual(401);
		});

		it("/authenticateUser should fail to authenticate as email is missing", async () => {
			const res = await request(app).post(`/authenticateUser`).send({
				password: "test_password",
			});
			expect(res.status).toEqual(400);
		});
	});
});
