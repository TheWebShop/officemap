/*global define*/

define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    'use strict';

    var GeolocationModel = Backbone.Model.extend({
        defaults: {
        }
    });

    return GeolocationModel;
});