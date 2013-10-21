/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'vent'
], function ($, _, Backbone, JST, vent) {
    'use strict';

    var GeolocationlistView = Backbone.View.extend({

        el: $("#geolocation-list")[0],

        $el: $("#geolocation-list"),

        template: JST['app/scripts/templates/geolocationList.ejs'],

        events: {
            'click .geolocation': 'focusGeolocation'
        },

        initialize: function(options) {
            _.extend(this, options);
            _.bindAll(this, 'render');

            this.geolocations.on('reset', this.render);
        },

        render: function() {
            this.$el.html(this.template({geolocations:  this.geolocations.toJSON()}))
                .fadeIn();
        },

        hide: function() {
            this.$el.hide();
        },

        focusGeolocation: function(e){
            var $target = $(e.target);
            var index = $target.data('geolocationlist-index');
            var geolocation = this.geolocations.models[index];

            vent.trigger('focus:geolocation', geolocation);
        }
    });

    return GeolocationlistView;
});
