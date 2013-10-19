/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'ejs',
    'typeahead'
], function ($, _, Backbone, JST, EJS) {
    'use strict';

    var SearchView = Backbone.View.extend({

        el: $("#search-map")[0],

        $el: $("#search-map"),

        template: JST['app/scripts/templates/search.ejs'],

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
                    Serving: Serving
                };
            });

            $('#search-input').typeahead({
                name: 'offices',
                local: offices,
                template: this.template(),
                engine: EJS
            });
        }
    });

    return SearchView;
});
