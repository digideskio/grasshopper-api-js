'use strict';

const api = require('../../../lib/grasshopper-api');
const BB = require('bluebird');
const configs = require('expressively').configs;

// This could technically be a const, but conceptually is a var
var ghInstance = require('./instance');

module.exports = function start() {
    console.log('ghapi options are', configs.grasshopper);
    const apiInitializationResults = api(configs.grasshopper);

    ghInstance.bridgetown = apiInitializationResults.bridgetown;
    ghInstance.core = apiInitializationResults.core;
    ghInstance.router = apiInitializationResults.router;

    return new BB(function(resolve, reject) {

        ghInstance
            .core.event.channel('/system/db')
            .on('start', function(payload, next) {
                console.log('starting grasshopper');
                ghInstance
                    .core.auth('basic', {
                    username : 'admin', password : 'TestPassword'
                })
                    .then(function (token) {
                        console.log('grasshopper authenticated');
                        ghInstance.request = ghInstance.core.request(token);
                        resolve();
                        next();
                    })
                    .catch(reject);
            });

        ghInstance
            .core.event.channel('/type/*')
            .on('save', function(kontx, next) {
                next();
            });

        ghInstance
            .core.event.channel('/content/*')
            .on('save', function(kontx, next) {
                next();
            });
    });
};