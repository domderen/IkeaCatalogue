# IkeaCatalogue #

[![Greenkeeper badge](https://badges.greenkeeper.io/domderen/IkeaCatalogue.svg)](https://greenkeeper.io/)

A simple search engine interface for Ikea products catalogue, which utilizes Import.IO API for data querying.

## Installation ##

1. Ensure that [NodeJS](http://nodejs.org/) is installed. This provides the platform on which the build tooling runs.
2. From the project folder, execute the following command:

  ```shell
  npm install
  ```
3. Ensure that [Gulp](http://gulpjs.com/) is installed. If you need to install it, use the following command:

  ```shell
  npm install -g gulp
  ```
4. Ensure that [jspm](http://jspm.io/) is installed. If you need to install it, use the following command:

  ```shell
  npm install -g jspm
  ```
  > **Note:** jspm queries GitHub to install semver packages, but GitHub has a rate limit on anonymous API requests. It is advised that you configure jspm with your GitHub credentials in order to avoid problems. You can do this by executing `jspm endpoint config github` and following the prompts.
5. Install the client-side dependencies with jspm:

  ```shell
  jspm install -y
  ```
  >**Note:** Windows users, if you experience an error of "unknown command unzip" you can solve this problem by doing `npm install -g unzip` and then re-running `jspm install`.
6. To run the app, execute the following command:

  ```shell
  gulp watch
  ```
7. Browse to [http://localhost:9000](http://localhost:9000) to see the app. You can make changes in the code found under `src` and the browser should auto-refresh itself as you save files.

## Unit tests ##

To run the unit tests, first ensure that you have followed the steps above in order to install all dependencies and successfully build the library. Once you have done that, proceed with these additional steps:

1. Ensure that the [Karma](http://karma-runner.github.io/) CLI is installed. If you need to install it, use the following command:

  ```shell
  npm install -g karma-cli
  ```
2. Install Aurelia libs for test visibility:

```shell
jspm install aurelia-framework
jspm install aurelia-http-client
jspm install aurelia-router
```
3. You can now run the tests with this command:

  ```shell
  karma start
  ```

## Project description ##

This application utilizes https://github.com/import-io/client-js-mini to query the ImportIO API, and obtain the data about Ikea products. It requires providing your User Guid and API Key to perform the query, as well as the Connector Guid that will be used to search for data. The connector that will be utilized has to first be trained for Ikea data.

I thought about utilizing https://github.com/import-io/client-js to create a standalone application, that doesn't require authentication, and just performs the queries, with backend server for signing them, but there two main problems with that.
* Full client-js library is cumbersome to connect though JSPM, as it doesn't expose the fully built version of the library at the moment, and JSPM by default does not allow script concatenation. It probably could be done by utilizing a Gulp script for scripts concatenation, but second point stopped me from experimenting with it more.
* Because of time constrains I didn't want to create a full blown application, that would allow performing signed queries, as this would require securing the possibility of making unauthorized queries, by authenticating users, or parsing query data on the server side. Instead I wanted to focus on ImportIO API utilization.

There is also a server side express application, that allows signing queries, based on provided userGuid and API Key in the config file. To run this application, first run:

  ```shell
  npm install
  ```

and next

  ```shell
  npm start
  ```

This will run the express application at port 3000, and will allow to send POST requests expecting a "query" parameter sent in the body, which will contain the query to be signed. In response it will return the digest constructed after signing the query.
