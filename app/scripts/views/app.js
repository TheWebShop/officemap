/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'views/map',
    'collections/officeList',
    'views/officeList',
    'collections/geolocations',
    'views/geolocationList',
    'views/search',
    'vent'
], function ($, _, Backbone, MapView, OfficelistCollection, OfficeListView, GeolocationsCollection, GeolocationListView, SearchView, vent) {
    'use strict';

    var AppView = Backbone.View.extend({

        el: $('body')[0],

        $el: $('body'),

        panelHeight: $('.panel').height(),

        panelOffsetTop: parseInt($('.panel').css('top').match(/(\d*)/)[0], 10),

        geolocations: new GeolocationsCollection(),

        events: {
            'click .show-offices': 'showOffices',
            'click .close-panel': 'closePanel'
        },

        initialize: function() {
            _.bindAll(this, 'resizePage', 'showOffices', 'showGeolocations', 'resizeDropdown');
            var appView = this;

            this.resizePage();
            $(window).on('resize', this.resizePage);

            this.gmap = new MapView();
            this.offices = new OfficelistCollection();
            this.officeList = new OfficeListView({
                offices: this.offices
            });
            this.geolocationList = new GeolocationListView({
                geolocations: this.geolocations
            });
            this.search = new SearchView({
                offices: this.offices
            });

            this.offices.on('add', function(model) {
                var marker = appView.gmap.addMarker(model);
                appView.gmap.addListener(marker, 'click', function() {
                    appView.gmap.showOfficePopup(this);
                });
            })
            .fetch({
                orderby: 'Office asc',
                add: true
            })
            .done(function() {
                appView.officeList.render();
                appView.search.render().appendTo(appView.$el);
            });

            this.geolocations.on({
                beforeFetch: this.gmap.clearGeolocations,
                reset: function(geolocations) {
                    geolocations.each(function(model) {
                        appView.gmap.addMarker(model, true);
                        appView.gmap.addListener(model.get('marker'), 'click', function() {
                            appView.gmap.showGeoPopup(this, appView.offices);
                        });
                    });

                    appView.gmap.centerMapOnMarkers(geolocations.pluck('marker'));
                    appView.showGeolocations(geolocations);
                }
            });

            vent.on({
                'focus:marker': this.gmap.focusMarker,
                'open:panel': this.openPanel,
                'close:panel': this.closePanel,
                'zoom': this.gmap.centerMap,
                'geolocate': _.bind(this.geolocate, this),
                'show:offices': this.showOffices(),
                'show:geolocations': this.showGeolocations(),
                'resize:dropdown': this.resizeDropdown
            });
        },

        openPanel: function() {
            $('#panel').slideDown(200);
        },

        closePanel: function() {
            $('#panel').slideUp(200);
        },

        resizePage: function() {
            var height = $(window).height() - $('#top-nav').height();
            $('#page').height(height);
        },

        geolocate: function(query) {
            this.geolocations.fetch(query);
        },

        showOffices: function() {
            this.geolocationList.hide();
            this.officeList.render();
        },

        showGeolocations: function() {
            this.officeList.hide();
            this.geolocationList.render();
        },

        resizeDropdown: function(height) {
            this.pushPanelDown(height);
        },

        pushPanelDown: function(distance) {
            var height = $('#panel').height();
            var screenHeight = $(window).height();

            if(height + this.panelOffsetTop + distance > screenHeight) {
                height = screenHeight - this.panelOffsetTop - distance;
            }else {
                height = Math.min(this.panelHeight, screenHeight - this.panelOffsetTop - distance);
            }

            $('#panel').css({
                top: this.panelOffsetTop + distance,
                height: height
            });
        }
    });

    return AppView;
});
