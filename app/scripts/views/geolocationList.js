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
        },

        render: function() {
            console.log(this)
            this.$el.html(this.template({geolocations:  this.geolocations.toJSON()}))
                .fadeIn();
        },

        hide: function() {
            this.$el.hide();
        },

        focusGeolocation: function(e){
            var $target = $(e.target);
            console.log($target)
            /*
            var id = $target.data('officelist-id');
            var office = this.offices.get(id);

            vent.trigger('focus:geolocation', geolocation);
            vent.trigger('toggle:leftPanel');
            */
        }
    });

    return GeolocationlistView;
});
