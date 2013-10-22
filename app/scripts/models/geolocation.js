/*global define*/

define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    'use strict';

    var GeolocationModel = Backbone.Model.extend({
        initialize: function() {
            var location = this.get('geometry').location;
            this.set({
                location: {
                    lat: location.lb,
                    lng: location.mb
                }
            });
        }
    });

    return GeolocationModel;
});
