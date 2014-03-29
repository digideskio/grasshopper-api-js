/**
 * The token api module is responsible for creating an access token to use the API.
 */
module.exports = function(app){
    'use strict';

    var token = {},
        async = require('async'),
        grasshopper = require('grasshopper-core'),
        bridgetown = require('bridgetown-api'),
        Response = bridgetown.Response,
        middleware = bridgetown.middleware,
        routePrefix = (app.get('grasshopper route prefix')) ? app.get('grasshopper route prefix') : '';

    /**
     * Method will pull out the username and password out of the auth header.
     * @param authHeader String found in the HTTP authentication header.
     * @param callback
     */
    function parseHeader(authHeader, callback){
        try {
            var parts=authHeader.split(/:/),
                username=parts[0],
                password=parts[1];

            callback(null, {username: username, password: password});
        }
        catch(ex){
            callback(ex);
        }
    }

    /**
     *  Sequence to generate a token should be: (All need to succeed to be valid)
     *  1) Get the auth token header
     *  2) Pull out the username and password from header.
     *  3) Get the user with the username passed in.
     *  4) Validate the password to make sure it matches
     *  5) Create the token.
     */
    token.get = function (httpRequest, httpResponse){
        var response = new Response(httpResponse);

        async.waterfall([
            function(next){
                parseHeader(httpRequest.bridgetown.token, function(err, creds){
                    next(err, creds.username, creds.password);
                });
            },
            function(userName, password, next){
                grasshopper.auth(userName, password).then(
                    function(token){
                        next(null, token);
                    },
                    function(err){
                        next(err);
                    }).done();
            }],
            function(err, accessToken){
                if(err){
                    response.writeUnauthorized();
                }
                else {
                    response.writeSuccess({
                        'access_token': new Buffer(accessToken).toString('base64'),
                        'token_type': 'Token'
                    });
                }
            });
    };

    token.getNew = function(httpRequest, httpResponse){
        var response = new Response(httpResponse);

        function writeResponse(token){
            var token = {
                'access_token': new Buffer(token).toString('base64'),
                'token_type': 'Token'
            };

            response.writeSuccess(token);
        }

        grasshopper.request(httpRequest.bridgetown.token).tokens.getNew().then(writeResponse);
    };

    token.deleteById = function(httpRequest, httpResponse){
        var response = new Response(httpResponse),
            promise = grasshopper.request(httpRequest.bridgetown.token).tokens.deleteById(httpRequest.bridgetown.token);

        response.writeFromPromise(promise);
    };

    //Setup Routes for included functions
    app.get(routePrefix + '/token', [middleware.authorization, token.get]);
    app.get(routePrefix + '/token/new', [middleware.authorization, middleware.authToken, token.getNew]);
    app.get(routePrefix + '/token/logout', [middleware.authorization, middleware.authToken, token.deleteById]);

    return token;
};