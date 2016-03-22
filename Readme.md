#A tiny url shortener

A Node.js based url shortening micro-service

##Getting Started
You will need Node.js installed on the system you are running this app on. We recommend 4.2.3, but other versions may work.

You need to have mongodb installed and running locally on port 27017 to run this application or its tests.

You also need to have npm installed to install the dependencies, run the tests, and run the app.

To install this app, clone this git repository to your local machine with the following command:

    git clone https://github.com/pbardondev/urlCrunch.git


##Running the tests
Mongodb needs to be running and able to connect or the tests will not work

You need to have nodeunit installed globally on your system to run the tests:

npm install -g nodeunit

To run the tests run the following command from the root of the urlCrunch directory:

    npm test

##Running the application
Mongodb needs to be running locally or on the host provided in the dbAddress field in the config.js file or the application will not run

To start the server run this command from the root of the urlCrunch directory:

    npm start

You may need to run this command as root the first time to create the initial log file.
