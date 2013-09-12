     _______                       _                                      _______ ______  _
    (_______)                     | |                                    (_______|_____ \| |
     _   ___  ____ _____  ___  ___| |__   ___  ____  ____  _____  ____    _______ _____) ) |
    | | (_  |/ ___|____ |/___)/___)  _ \ / _ \|  _ \|  _ \| ___ |/ ___)  |  ___  |  ____/| |
    | |___) | |   / ___ |___ |___ | | | | |_| | |_| | |_| | ____| |      | |   | | |     | |
     \_____/|_|   \_____(___/(___/|_| |_|\___/|  __/|  __/|_____)_|      |_|   |_|_|     |_|
                                              |_|   |_|


# What am I?

Grasshopper is the internal code word for our CMS product. We build this system in 2005 and have used it on hundreds
of websites. In an effort to bring this code up to date we are porting it from a relational database and code written
in C# to a document database written in Node. This project is a definition for the API methods that will interface
with the no-sql databases. In theory we can create a variety of backend api's in many languages as long as they
implement the same methods.

# Why would you want to use me?

We conistantly get requested to make mobile applications or quick websites. Many times the existing open source cms
products do not cut it. Our cms is different as it is truely more of a data management tool than a website creator.
This distinction makes it very appealing when creating apis or non-traditional websites that need a tool to easily edit
data.


# Architecture

## api

The ```api``` module is the MAIN module. It is the glue that the system needs to perform it's operations. The idea is
that is has references to everything it needs but it only exposes actionable functionality externally.

To use the api you would interact with it like this:

```
var api = require('grasshopper-api');
api.init({
     cache: {
        path: path.resolve(__dirname, "../") + "/cache"
     },
     db: {
         type: 'couchdb',
         database: '',
         host: '',
         username: '',
         password: ''
     },
     logger: {
         adapters: [{
             type: "file",
             path: path.resolve(__dirname, "../") + "/log/grasshopper.log",
             application: 'grasshopper-api',
             machine: 'dev-server'
         }]
     }
});

var authToken = api.auth.init({
    username: '',
    password: ''
});

api.nodes.<operation>(authToken, <params>);
```

## app

The ```app``` module maintains references to the logger object and the db engine. Since we can have more than one db
engine the preferred way to work with any data storage is through the ```app.db``` object.


## entities

The entities modules are all objects that the system needs. They are things like ```nodes```, ```contenttypes```, ```content```,
```users```, ```permissions```, etc.


## db engines

The modules in the ```db``` directory are all implementations of our standard interface that define how a specific
database engine manages data entry and access.

Available engines:

   * Couch DB


## utils

All helper functions should be added to the utils folder.

    * Crypto: For hashing password and support for two way encryption for data stored in memory.


# Database Schema

[No-SQL Schema](../blob/master/docs/db.md)

# API Concepts

Coming...


# API Methods

## Query

## Node

--------------------------------------------------------------------------------------------------------------

### getChildNodes(nodeid, recurrsive = false)

    * Method that will return a list of nodes from a parent

## Content


# Running Tests

There are a couple of ways to run our unit tests.

* $: make test
* $: npm test

# Using the API

## Authentication & Headers

With each API call, you'll need to set up your request headers, including an OAuth 2.0 access token. Get an access token by using the OAuth 2.0 'client-credentials' token grant type with your client_id:secret as your Basic Auth credentials.

### Necessary Headers

* Authorization: When requesting an access token, send the value as the HTTP Basic Authentication credentials using your client_id and secret. You can specify them as -u "client_id:secret" they should be base64 encoded in your application but if you are using curl for testing you can leave it in plain text. When calling APIs, send the value as the OAuth 2.0 access token with the authentication type set as Token (Example: Authorization: Token {AccessToken}).
* Accept: Set to application/json.
* (optional) X-HTTP-Method-Override: If you do not want to use actual HTTP methods like "put" or "delete" then you can use this header to override the methods.


## Example Curl Requests

### Request an access token

    curl https://{url}/token \
     -H "Accept: application/json" \
     -H "Accept-Language: en_US" \
     -u "{client_id}:{secret}"

### Example Response

    {
        "access_token":"9c55f367-557b-4ddb-ad90-3957fbec474d",
        "token_type":"Token"
    }


# License
Grasshopper API JS is released under a [MIT license](../blob/master/LICENSE).