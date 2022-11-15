# One Click Buy E-commerce Application

### Course - SOEN 6411: Advanced Programming Practices

&nbsp;
&nbsp;

## How to run the project

1. Install NodeJS from https://nodejs.org/en/download/
2. Clone the Project

```
git clone https://github.com/anantshukla/One-Click-E-Commerce-MarketplaceApp.git
```

3. Run the API Server

```
cd backend-ecommerce_marketplace
npm install
npm run start
```

4. Run the Front End application

```
cd backend-ecommerce_marketplace
npm install
npm run start
```

A browser session on http://localhost:3000 with the front end of the application.

<u>Note:</u> Backend is hosted on http://localhost:3001

&nbsp;

## Project Overview

The project aims to build an e-commerce application which allows users to make online
purchases at the ease of their comfort. Besides providing the main functionality the project aims
to demonstrate the accepted development procedures and structures for project development.

The major functionalities of the project are:

- Any user can register/ create a new account.
- Registered users can only login with username and password given while creating
  their accounts.
- Only registered users can access the available product catalog.
- Only registered users can access the details of a particular product.

&nbsp;
&nbsp;

The major components of the projects are:

- Demonstrating usage of proper design patterns, object-relational structures.
- Implement refactoring strategies on the code.
- Performing unit testing.
- Populating the database via an API.
- Parameterized Queries.

&nbsp;
&nbsp;

## Tech Stack

| Technology                                      | Description                 |
| ----------------------------------------------- | --------------------------- |
| NodeJS - ExpressJS Backend                      | REST API                    |
| React JS                                        | Frontend                    |
| SQLite                                          | Database                    |
| Jest, Supertest and Istanbul for Test Reporting | Testing Framework/Reporting |

&nbsp;
&nbsp;

# REST API Documentation for One Click E-Commerce Marketplace

## Product Controller

- `POST /addProductsToCatalog/`: Adds products to Catalog Database
- `GET /getAllProductCategories/`: Gets all the Product Categories available
- `POST /getAllProducts/`: Gets a list of all products
- `POST /getProductDetails/`: Gets Details of a particular product
- `GET /getProductImage/`: Gets the Image of a particular product

## User Controller

- `POST /createUser/`: Creates a new user
- `POST /authenticateUser/`: Authenticate the User and Confirm is the email and password match

&nbsp;
&nbsp;

## FlowChart

![Flow Chart](FlowChart.png?raw=true "Flow Chart")
