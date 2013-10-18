/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'views/map',
    'collections/officeList',
    'views/officeList',
    'vent'
], function ($, _, Backbone, MapView, OfficelistCollection, OfficeListView, vent) {
    'use strict';

    var AppView = Backbone.View.extend({

        el: $("body")[0],

        $el: $("body"),

        initialize: function() {
            var appView = this;

            this.resizePage();
            $(window).on('resize', this.resizePage);

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

            vent.on({
                'home': this.gmap.home,
                'toggle:leftPanel': this.toggleLeftPanel,
                'zoom': this.gmap.zoom
            });

            _.bindAll(this, 'resizePage');
        },

        toggleLeftPanel: function() {
            $('#left-panel').toggleClass('open');
            $('#map-container').toggleClass('pushed');
        },

        resizePage: function() {
            var height = $(window).height() - $('#top-nav').height();
            $('#page').height(height);
        }

    });

    return AppView;
});
