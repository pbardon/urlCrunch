***A tiny url shortener***



***Prerequisites***


You will need Node.js installed on the system you are running this app on.

You need to have mongodb installed and running locally on port 127017 to run this app or its testOnPost

You also need to have npm installed to install the dependencies, run the tests, and run the app.

You need to have nodeunit installed globally on your system to run the tests:

npm install -g nodeunit

To install this app, clone this git repository to your local machine with the following command:

git clone



***Running the tests***

Mongodb needs to be running or the tests will not work

To run the tests run the following command from the root of the urlCrunch directory:
    npm test

***Running the application***

Mongodb needs to be running locally or on the host provided in the dbAdress field in config.js or the application will not run

To start the server run this command from the root of the urlCrunch directory:

npm start

(You may need to run this command as root the first time to create the logfile)
