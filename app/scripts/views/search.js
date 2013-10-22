/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'ejs',
    'vent',
    'typeahead'
], function ($, _, Backbone, JST, EJS, vent) {
    'use strict';

    var SearchView = Backbone.View.extend({

        el: $("#search-map")[0],

        $el: $("#search-map"),

        $input: $('#search-input'),

        template: JST['app/scripts/templates/search.ejs'],

        events: {
            'click #search-button': 'geolocate',
            'typeahead:selected #search-input': 'focusOffice'
        },

        initialize: function(options) {
            _.extend(this, options);
        },

        render: function() {
            var offices = this.offices.map(function(office) {
                var Name = office.get('Name');
                var Office = office.get('Office');
                var Serving = office.get('Serving');

                return {
                    value: Name + Office + Serving,
                    Name: Name,
                    Office: Office,
                    Serving: Serving,
                    model: office
                };
            });

            $('#search-input').typeahead({
                name: 'offices',
                local: offices,
                template: this.template(),
                engine: EJS
            });

            this.$el.fadeIn();
        },

        geolocate: function(e) {
            e.preventDefault();
            vent.trigger('geolocate', this.$input.val());
            vent.trigger('open:leftPanel');
        },

        focusOffice: function(e, selection) {
            vent.trigger('focus:marker', selection.model);
        }
    });

    return SearchView;
});
