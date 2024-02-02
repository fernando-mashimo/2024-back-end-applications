# Liah App: Catalog of Products

[![License](https://img.shields.io/badge/license-UNLICENSED-red.svg)](LICENSE)

## Description

App Liah's Catalog of Products project is a backend application built with Nest.js for managing catalog products. It provides APIs to search and list products based on various criteria such as name, brand, category, and seller.

## Features

- Search products by name and seller
- Filter products by brand, category, and seller
- Sort products by name and price
- Retrieve detailed information about a specific product

## Installation

To install and set up the project, follow these steps:

1. Clone the repository: `git clone <repository-url>`
2. Install dependencies: `npm install`
3. Set up environment variables: Create a `.env` file and configure the necessary environment variables. Refer to the `.env.example` file for the required variables.
4. Start the application:
    - Dev: `npm run start`
    - Dev w/ watch mode: `npm run start:dev`
    - Prod: `npm run start:prod`

## Usage

To use the Catalog Products API, follow these guidelines:

- Search Products by Name and Seller:
  - Endpoint: `/catalog-products/search/:nameProduct/:sellerIds`
  - Method: `GET`
  - Path Parameters:
    - `nameProduct`: The name of the product to search for
    - `sellerIds`: Comma-separated list of seller IDs to filter the search results
  - Response: Returns an array of catalog products matching the search criteria

- List Products:
  - Endpoint: `/catalog-products/filter`
  - Method: `GET`
  - Query Parameters:
    - `filters`: JSON-encoded string containing search and filter criteria
  - Response: Returns an array of catalog products based on the provided filters

- Get Product by ID:
  - Endpoint: `/catalog-products/:id`
  - Method: `GET`
  - Path Parameters:
    - `id`: The ID of the product to retrieve
  - Response: Returns detailed information about the specified product

For more detailed API documentation, refer to the application's Swagger UI at `http://localhost:3000/api`.
