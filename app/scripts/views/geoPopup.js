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
            'click .zoom': 'zoomOnMarker',
            'click .office': 'focusOffice'
        },

        initialize: function(options) {
            _.extend(this, options);
            _.bindAll(this, 'sortMarkersByDistance', 'focusOffice');

            var neighbours = this.offices.pluck('marker');
            neighbours = this.sortMarkersByDistance(neighbours);

            this.model.set('neighbours', _.pluck(neighbours, 'model'));
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
            };

            return _.sortBy(markers, distanceFromHere);
        },

        focusOffice: function(e){
            var $target = $(e.target);
            var id = $target.data('officelist-id');
            var model = this.offices.get(id);

            vent.trigger('focus:marker', model);
        }
    });

    return GeopopupView;
});
