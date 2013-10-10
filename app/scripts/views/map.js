/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'gmaps'
], function ($, _, Backbone, gmaps) {
    'use strict';

    var MapView = Backbone.View.extend({
        el: $("#map")[0],
        $el: $("#map"),
        mapOptions: {
            zoom: 8,
            center: new google.maps.LatLng(-34.397, 150.644),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        },
        render: function() {
            this.map = new google.maps.Map(this.el, this.mapOptions);

            return this.$el
        }
    });

    return MapView;
});
