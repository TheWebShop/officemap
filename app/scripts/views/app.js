/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'views/map',
    'collections/officeList',
    'views/officeList'
], function ($, _, Backbone, MapView, OfficelistCollection, OfficeListView) {
    'use strict';

    var AppView = Backbone.View.extend({

        el: $("#app")[0],

        $el: $("#app"),

        initialize: function() {
            var appView = this;
            this.gmap = new MapView();
            this.offices = new OfficelistCollection();
            this.officeList = new OfficeListView({
                offices: this.offices
            });

            this.offices
                .on('add', this.gmap.addOfficeMarker)
                .fetch({
                    orderby: 'Office asc',
                    add: true
                })
                .done(function() {
                    appView.officeList.render();
                });
        }
    });

    return AppView;
});
