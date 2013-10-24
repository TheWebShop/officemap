/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'vent'
], function ($, _, Backbone, JST, vent) {
    'use strict';

    var GeopopupView = Backbone.View.extend({
        template: JST['app/scripts/templates/geoPopup.ejs'],

        className: 'gmap-popup',

        events: {
            'click .zoom': 'zoomOnMarker'
        },

        initialize: function(options) {
            _.bindAll(this, 'sortMarkersByDistance');

            var markers = options.offices.pluck('marker');
            markers = this.sortMarkersByDistance(markers);

            this.model.set('neighbours', _.pluck(markers, 'model'));
        },

        render: function() {
            $(this.el).html(this.template(this.model.attributes));

            return this;
        },

        zoomOnMarker: function(e) {
            var marker = this.model.get('marker');

            vent.trigger('zoom', {
                position: marker.getPosition(),
                zoom: 15
            });
            e.preventDefault();
        },

        sortMarkersByDistance: function(markers) {
            var position = this.model.get('marker').getPosition();
            var x0 = position.lat();
            var y0 = position.lng();
            var distanceFromHere = function(marker) {
                var position = marker.getPosition();
                var x = position.lat();
                var y = position.lng();

                return Math.sqrt(Math.pow((x - x0), 2) + Math.pow(y - y0, 2));
            }

            return _.sortBy(markers, distanceFromHere);
        }
    });

    return GeopopupView;
});
