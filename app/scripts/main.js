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
        },
        typeahead: {
            deps: [
                'jquery'
            ],
            exports: 'jquery'
        }
    },
    paths: {
        jquery: '../bower_components/jquery/jquery',
        backbone: '../bower_components/backbone/backbone',
        underscore: '../bower_components/underscore/underscore',
        async: '../bower_components/requirejs-plugins/src/async',
        'backbone.sharepoint': '../bower_components/backbone.sharepoint/backbone-sharepoint.amd',
        typeahead: '../bower_components/typeahead.js/dist/typeahead',
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
