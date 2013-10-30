/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'gmaps',
    'views/mapControl',
    'views/search',
    'views/GeoPopup',
    'views/OfficePopup'
], function ($, _, Backbone, JST, gmaps, MapcontrolView, SearchView, GeoPopup, OfficePopup) {
    'use strict';

    // as per http://stackoverflow.com/questions/7095574/google-maps-api-3-custom-marker-color-for-default-dot-marker/7686977#7686977
    /* the service is not responding for some reason
    var PinImage = function(color) {
        var pinColor = color || 'FE7569';

        return new gmaps.MarkerImage('https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|' + pinColor,
            new gmaps.Size(21, 34),
            new gmaps.Point(0,0),
            new gmaps.Point(10, 34));
    };
    /* in case you want a shadow later
    var PinShadow = function() {

        return new gmaps.MarkerImage('https://chart.apis.google.com/chart?chst=d_map_pin_shadow',
            new gmaps.Size(40, 37),
            new gmaps.Point(0, 0),
            new gmaps.Point(12, 35));
    };
    */
    var blueMarkerIcon = {
        url: 'images/marker@2x.png',
        size: new google.maps.Size(44, 40),
        scaledSize: new google.maps.Size(22, 40),
        // The anchor for this image is the bottom center of the image
        anchor: new google.maps.Point(11, 40)
    };
    var MapView = Backbone.View.extend({

        el: $('#map')[0],

        $el: $('#map'),

        mapOptions: {
            center: new gmaps.LatLng(53.7266683, -127.64762059999998),
            zoom: 6,
            mapTypeId: gmaps.MapTypeId.ROADMAP,
            panControl: true,
            panControlOptions: {
                position: gmaps.ControlPosition.RIGHT_CENTER
            },
            zoomControl: true,
            zoomControlOptions: {
                style: gmaps.ZoomControlStyle.LARGE,
                position: gmaps.ControlPosition.RIGHT_CENTER
            }
        },

        controlTemplate: JST['app/scripts/templates/mapControl.ejs'],

        infowindow: new gmaps.InfoWindow({
            maxWidth: 300
        }),

        initialize: function() {
            _.bindAll(this, 'addMarker', 'centerMap', 'centerMapOnMarkers', 'mapGeolocations', 'addListener');

            this.map = new gmaps.Map(this.el, this.mapOptions);
            this.infowindow = new gmaps.InfoWindow({
                maxWidth: 300
            });

            var homeMapControl = new MapcontrolView({
                title: 'Click to zoom out',
                text: 'Home',
                className: 'home'
            });
            this.map.controls[gmaps.ControlPosition.TOP_CENTER].push(homeMapControl.el);
            gmaps.event.addDomListener(homeMapControl.el, 'click', this.centerMap);
        },

        addMarker: function(model, useAlternateIcon) {
            var location = model.get('location');
            var opts = {
                position: new gmaps.LatLng(location.lat, location.lng),
                map: this.map,
                model: model
            };
            if(useAlternateIcon) {
                opts.icon = blueMarkerIcon;
            }
            var marker = new gmaps.Marker(opts);

            model.set('marker', marker);

            return marker;
        },

        clearGeolocations: function(geolocations) {
            _.each(geolocations.models, function(model) {
                model.get('marker').setMap(null);
            });
        },

        mapGeolocations: function(geolocations) {
            var mapView = this;
            _.each(geolocations.models, function(model) {
                mapView.addMarker(model, true);
            });
        },

        showGeoPopup: function(marker, offices) {
            this.popup = new GeoPopup({
                model: marker.model,
                offices: offices
            });
            this.infowindow.open(this.map, marker);
            this.infowindow.setContent(this.popup.render().el);

        },

        showOfficePopup: function(marker) {
            this.popup = new OfficePopup({model: marker.model});
            this.infowindow.setContent(this.popup.render().el);
            this.infowindow.open(this.map, marker);
        },

        centerMap: function(options) {
            this.map.setCenter(options.position || this.mapOptions.center);
            this.map.setZoom(options.zoom || this.mapOptions.zoom);
        },

        centerMapOnMarkers: function(markers) {
            if(markers.length === 1) {
                this.centerMap({
                    position: markers[0].getPosition(),
                    zoom: 15
                });
            }else {
                var bounds = new gmaps.LatLngBounds();
                _.each(markers, function(marker) {
                    bounds.extend(marker.position);
                });
                this.map.fitBounds(bounds);
            }
        },

        focusMarker: function(model){
            new gmaps.event.trigger(model.get('marker'), 'click');
        },

        addListener: function(marker, type, callback) {
            gmaps.event.addListener(marker, 'click', callback);
        }
    });

    return MapView;
});
