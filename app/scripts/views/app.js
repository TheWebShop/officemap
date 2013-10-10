/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'views/map',
    'collections/officeList'
], function ($, _, Backbone, MapView, OfficelistCollection) {
    'use strict';

    var AppView = Backbone.View.extend({

        el: $("#app")[0],

        $el: $("#app"),

        initialize: function() {
            this.gmap = new MapView;
            this.offices = new OfficelistCollection();
            this.offices.fetch({
                orderby: 'Office asc'
            });

            this.$el.append(this.gmap.render());
        }
    });

    return AppView;
});
