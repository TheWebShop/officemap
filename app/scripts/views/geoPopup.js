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
        }
    });

    return GeopopupView;
});
