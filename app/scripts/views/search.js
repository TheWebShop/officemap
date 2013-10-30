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

        dropdownHeight: 0,

        searchTemplate: JST['app/scripts/templates/search.ejs'],

        suggestionTemplate: JST['app/scripts/templates/suggestion.ejs'],

        id: 'search-container',

        className: 'search-container searchbox-shadow',

        events: {
            'click #search-button': 'geolocate',
            'typeahead:selected #search-input': 'focusOffice',
            'focus #search-input': 'focusInput',
            'input #search-input': 'changeInput',
            'blur #search-input': 'blurInput'
        },

        initialize: function(options) {
            _.extend(this, options);
            _.bindAll(this, 'measureDropdown');
        },

        render: function() {
            $(this.el).html(this.searchTemplate());

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

            this.$el.find('#search-input').typeahead({
                name: 'offices',
                local: offices,
                template: this.suggestionTemplate(),
                engine: EJS
            })
            // IE8 shim
            .on('propertychange', function() {
                $(this).trigger('input');
            });

            $(window).on('resize', this.measureDropdown);

            return this.$el;
        },

        geolocate: function(e) {
            e.preventDefault();
            vent.trigger('geolocate', this.$el.find('#search-input').val());
            vent.trigger('open:panel');
        },

        focusOffice: function(e, selection) {
            vent.trigger('focus:marker', selection.model);
            this.measureDropdown();
        },

        focusInput: function() {
            vent.trigger('open:panel');
            this.measureDropdown();
        },

        changeInput: function() {
            this.measureDropdown();
        },

        blurInput: function() {
            this.measureDropdown();
        },

        measureDropdown: function(e) {
            var forceResize = !!e;
            var height = this.$el.find('.tt-dropdown-menu').outerHeight();

            if(forceResize || height !== this.dropdownHeight){
                this.dropdownHeight = height;
                vent.trigger('resize:dropdown', this.dropdownHeight);
            }
        }
    });

    return SearchView;
});
