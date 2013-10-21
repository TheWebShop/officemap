/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'nprogress',
    'views/map',
    'collections/officeList',
    'views/officeList',
    'views/search',
    'vent'
], function ($, _, Backbone, NProgress, MapView, OfficelistCollection, OfficeListView, SearchView, vent) {
    'use strict';

    var AppView = Backbone.View.extend({

        el: $("body")[0],

        $el: $("body"),

        initialize: function() {
            NProgress.start();
            var appView = this;

            this.resizePage();
            $(window).on('resize', this.resizePage);

            this.gmap = new MapView();
            this.offices = new OfficelistCollection();
            this.officeList = new OfficeListView({
                offices: this.offices
            });
            this.search = new SearchView({
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
                    appView.search.render();
                    NProgress.done();
                });

            vent.on({
                'focus:office': this.gmap.focusOffice,
                'home': this.gmap.home,
                'toggle:leftPanel': this.toggleLeftPanel,
                'zoom': this.gmap.zoom
            });

            _.bindAll(this, 'resizePage');
        },

        toggleLeftPanel: function() {
            $('#left-panel').toggleClass('open');
            $('#map-container').toggleClass('pushed');
            vent.trigger('resize');
        },

        resizePage: function() {
            var height = $(window).height() - $('#top-nav').height();
            $('#page').height(height);
        }

    });

    return AppView;
});
