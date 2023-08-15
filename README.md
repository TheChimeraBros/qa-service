# Questions & Answers Service Backend
This repository contains the backend Express server for the Questions & Answers service of a clothing e-commerce website. The service is responsible for handling user inquiries, allowing them to ask and answer questions about products available on the website.

## Table of Contents
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Database](#database)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)


## Getting Started

Follow the instructions below to set up the backend server on your local machine.

### Prerequisites
Before you begin, ensure you have the following installed:

* Node.js (v14 or later)
* npm (Node Package Manager)
* PostgreSQL 15

### Installation
1. Clone this repository to your local machine using:
```bash
git clone https://github.com/your-username/questions-answers-backend.git
```

2. Navigate to the project directory:

```bash
cd questions-answers-backend
```

3. Install the required dependencies:

```bash
npm install
```
4. Create a .env file in the root directory and provide the necessary environment variables. Here is an example:

```bash
PGUSER=postgres_user
PGHOST=postgres_host
PGPASSWORD=postgres_password
PGDATABASE=postgres_db
PGPORT=postgres_port
PORT=3001
```
5. Start the server:

```bash
npm start
```
The server will run on the specified port (default: 3001).

## Usage
The Questions & Answers service provides APIs for managing product-related questions and answers. You can integrate these APIs with your clothing e-commerce website frontend to allow users to ask and answer questions about products.

## API Endpoints
* `GET /api/questions`: Get a list questions for a given product id passed as a query param.
* `GET /api/questions/:question_id/answers`: Get a list of answers for a given question id.
* `POST /api/questions`: Add a question for a product id passed as a query param.
* `POST /api/questions/:question_id/answers`: Adds an answer for a given question_id.
* `PUT /api/questions/:question_id/helpful`: Marks a question as helpful by incrementing helpfulness count.
* `PUT /api/questions/:question_id/report`: Updates question's "reported" field to true, marking the question as reported.
* `PUT /api/answers/:answer_id/helpful`: Marks an answer as helpful by incrementing helpfulness count.
* `PUT /api/answers/:answer_id/report`: Updates answer's "reported" field to true, marking the answer as reported.

## Database
This project uses PostgreSQL 15 as the database to store questions and answers. Ensure you have PostgreSQL set up and running before starting the server.

## Technologies Used
![Node.js](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)
![AWS EC2](https://img.shields.io/badge/Amazon_AWS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)

## Contributing
We welcome contributions to improve this backend server. To contribute, follow these steps:

1. Fork the repository.
2. Create a new branch for your feature/bugfix.
3. Make your changes and test thoroughly.
4. Create a pull request with a detailed description of your changes.


## License
This project is licensed under the MIT License.