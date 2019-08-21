# iReporter

<a href="https://codeclimate.com/github/AbuchiKings/iReporter/maintainability"><img src="https://api.codeclimate.com/v1/badges/09e7f232ab426a440388/maintainability" />  [![Build Status](https://travis-ci.org/AbuchiKings/iReporter.svg?branch=develop)](https://travis-ci.org/AbuchiKings/iReporter) [![Coverage Status](https://coveralls.io/repos/github/AbuchiKings/iReporter/badge.svg?branch=develop)](https://coveralls.io/github/AbuchiKings/iReporter?branch=develop)

iReporter is a web app that allows users to report instances of illegal conducts or situations in need of government intervention.

#### **Homepage** - [iReporter](https://abuchikings-ireporter.herokuapp.com/) 

* [Technologies Used](#technologies-used)
* [Features](#features)
* [API Endpoints](#api-endpoints)
* [Getting Started](#getting-started)
    * [Installation](#installation)
    * [Testing](#testing)
* [Authors](#authors)



## Technologies Used

* [Node.js](https://nodejs.org) - A runtime environment based off of Chrome's V8 Engine for writing Javascript code on the server.
* [PostgreSQL](https://www.postgresql.org) - An Object relational database from Elephant SQL.
* [Express.js](https://expressjs.com) - A Node.js framework.
* [Babel](https://babeljs.io) - Javascript transpiler.
* [Postman](https://www.getpostman.com/) - API testing environment.



## Features

* Users can sign up for accounts.
* Users can log into their accounts.
* Users can add image and videos to their red-flag or intervention reports.
* Users can create and delete red-flag or intervention records created by them.
* Admin can change the status of a red-flag or intervention records.
* Users get email and/or sms update when the status of their records are changed.
* Users can edit records if they are not yet under investigation.
* Users can update their email and passord.
* Admin can view all red-flag records.
* Admin can view all users. 
* Users can delete their accounts. 


## API Endpoints

### basepath ({window.location.origin})/api/v1

* GET all red-flag records          (/red-flags)
* GET a red-flag record             (/red-flags/:id)
* GET all users                     (/users)
* GET a user by id                  (/users/:id)
* GET a user by their username      (/users/get-by-username/:username)
* POST a red flag flag record       (/red-flags)
* POST: Create a user account       (/auth/signup)
* POST: User login                  (/auth/login)
* PATCH red-flag record             (/red-flags/:id)
* PATCH red-flag status             (/red-flags/status/:id)
* PATCH user email                  (/users/update-email)
* PATCH user password               (/users/update-password)
* DELETE red-flag record            (/red-flags/:id)
* Delete a user's account (uses a Post request)           (/users/delete)


## Getting Started

### Installation

* Install [NodeJs](https://nodejs.org/en/download/), [PostgreSQL](https://www.postgresql.org/download/) and [Postman](https://www.getpostman.com/) on your computer.
* Create a database named `ireport
* git clone [iReporter](https://github.com/AbuchiKings/iReporter.git)
* Run npm install to install packages
* Run npm start to start the server
* Open [localhost:5000](http://localhost:5000/) on  [Postman](https://www.getpostman.com/) to access the endpoints.

### Testing


## Authors
*  Abuchi Kingsley Ndinigwe