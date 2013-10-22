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
    'views/GeoPopup',
    'views/OfficePopup',
    'vent'
], function ($, _, Backbone, MapView, OfficelistCollection, OfficeListView, GeolocationsCollection, GeolocationlistView, SearchView, GeoPopup, OfficePopup, vent) {
    'use strict';

    var AppView = Backbone.View.extend({

        el: $("body")[0],

        $el: $("body"),

        geolocations: new GeolocationsCollection(),

        events: {
            'click .show-offices': 'showOffices'
        },

        initialize: function() {
            _.bindAll(this, 'resizePage', 'showOffices', 'showGeolocations');
            var appView = this;

            this.resizePage();
            $(window).on('resize', this.resizePage);

            this.gmap = new MapView();
            this.offices = new OfficelistCollection();
            this.officeList = new OfficeListView({
                offices: this.offices
            });
            this.geolocationList = new GeolocationlistView({
                geolocations: this.geolocations
            });
            this.search = new SearchView({
                offices: this.offices
            });

            this.offices.on('add', function(model) {
                var marker = appView.gmap.addMarker(model);
                google.maps.event.addListener(marker, 'click', function() {
                    appView.gmap.showMarkerPopup(OfficePopup, this);
                });
            })
            .fetch({
                orderby: 'Office asc',
                add: true
            })
            .done(function() {
                appView.officeList.render();
                appView.search.render();
            });

            this.geolocations.on({
                beforeFetch: this.gmap.clearGeolocations,
                reset: function(geolocations) {
                    geolocations.each(function(model) {
                        appView.gmap.addMarker(model, 'efefef');
                        google.maps.event.addListener(model.get('marker'), 'click', function() {
                            appView.gmap.showMarkerPopup(GeoPopup, this);
                        });
                    });

                    appView.gmap.centerMapOnMarkers(geolocations.pluck('marker'));
                    appView.showGeolocations(geolocations);
                }
            });

            vent.on({
                'focus:marker': this.gmap.focusMarker,
                'open:leftPanel': this.openLeftPanel,
                'toggle:leftPanel': this.toggleLeftPanel,
                'zoom': this.gmap.centerMap,
                'geolocate': _.bind(this.geolocate, this),
                'show:offices': this.showOffices(),
                'show:geolocations': this.showGeolocations()
            });
        },

        openLeftPanel: function() {
            $('#left-panel').addClass('open');
            $('#map-container').addClass('pushed');
            vent.trigger('resize');
        },

        toggleLeftPanel: function() {
            $('#left-panel').toggleClass('open');
            $('#map-container').toggleClass('pushed');
            vent.trigger('resize');
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
        }
    });

    return AppView;
});
