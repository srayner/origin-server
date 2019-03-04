### Origin Server

A backend node server for persisting family tree data used by the Origin Genealogy application.

## Installation

git clone https://github.com/srayner/origin-server.git
cd origin-server
npm install

## Post installation taks

Create a .env file with the following contents:

JWT_KEY="your-secret-key"
EMAIL_ACCOUNT="your-email-account"
EMAIL_PASSWORD="your-email-account-password"
EMAIL_FROM="origin-genealogy@yourdomain.com"

Be sure to use a secret key for JWT. This is used to sign your authentication tokens.
The email setting are for sending account verification emails. Access to an email server is required to send emails from the origin application.

## Running the server

Currently the server is hard-coded to listen for requests on port 8001. This will be changed in the future to be configurable. If you can't or don't want to use port 8001, just edit the server.js file, or figure out your own solution.

Start the server with:

npm start
