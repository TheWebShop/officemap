/*global require*/
'use strict';

require.config({
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        }
    },
    paths: {
        jquery: '../bower_components/jquery/jquery',
        backbone: '../bower_components/backbone/backbone',
        underscore: '../bower_components/underscore/underscore',
        async: '../bower_components/requirejs-plugins/src/async'
    },
    waitSeconds : 120 //make sure it is enough to load all gmaps scripts
});

require([
    'backbone',
    'gmaps'
], function (Backbone, gmaps) {
    Backbone.history.start();
});
