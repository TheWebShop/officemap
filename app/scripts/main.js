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
        async: '../bower_components/requirejs-plugins/src/async',
        'backbone.sharepoint': '../bower_components/backbone.sharepoint/backbone-sharepoint.amd'
    },
    waitSeconds: 120 //make sure it is enough to load all gmaps scripts
});

require([
    'backbone',
    'views/app'
], function (Backbone, AppView) {
    var App = new AppView;

    Backbone.history.start();
});
