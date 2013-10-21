/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'gmaps',
    'views/OfficePopup',
    'views/mapControl',
    'vent'
], function ($, _, Backbone, JST, gmaps, OfficePopup, MapcontrolView, vent) {
    'use strict';

    // as per http://stackoverflow.com/questions/7095574/google-maps-api-3-custom-marker-color-for-default-dot-marker/7686977#7686977
    var PinImage = function(color) {
        var pinColor = color || 'FE7569';

        return new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
            new google.maps.Size(21, 34),
            new google.maps.Point(0,0),
            new google.maps.Point(10, 34));
    }
    var PinShadow = function(color) {
        var pinColor = color || 'FE7569';

        return new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_shadow",
            new google.maps.Size(40, 37),
            new google.maps.Point(0, 0),
            new google.maps.Point(12, 35));
    }

    var MapView = Backbone.View.extend({

        el: $("#map")[0],

        $el: $("#map"),

        mapOptions: {
            center: new google.maps.LatLng(53.7266683, -127.64762059999998),
            zoom: 6,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            panControl: true,
            panControlOptions: {
                position: google.maps.ControlPosition.LEFT_TOP
            },
            zoomControl: true,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.LARGE,
                position: google.maps.ControlPosition.LEFT_TOP
            }
        },

        controlTemplate: JST['app/scripts/templates/mapControl.ejs'],

        infowindow: new google.maps.InfoWindow({
            maxWidth: 300
        }),

        initialize: function(options) {
            var mapView = this;
            _.bindAll(this, 'addOfficeMarker', 'addGeoMarker', 'zoom', 'home', 'mapGeolocations');

            this.map = new google.maps.Map(this.el, this.mapOptions);
            this.infowindow = new google.maps.InfoWindow({
                maxWidth: 300
            });

            var leftPanelControl = new MapcontrolView({
                title: 'Show Panel',
                text: 'Show Panel',
                className: 'expand-left'
            });
            this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(leftPanelControl.el);
            google.maps.event.addDomListener(leftPanelControl.el, 'click', function() {
                vent.trigger('toggle:leftPanel');
            });

            var homeMapControl = new MapcontrolView({
                title: 'Click to zoom out',
                text: 'Home',
                className: 'home'
            });
            this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(homeMapControl.el);
            google.maps.event.addDomListener(homeMapControl.el, 'click', function() {
                vent.trigger('home');
            });

            vent.on({
                resize: function() {
                    google.maps.event.trigger(this.map, 'resize');
                }
            });
        },

        addOfficeMarker: function(office) {
            var mapView = this;
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(office.get('Latitude'), office.get('Longitude')),
                map: this.map,
                office: office
            });

            office.marker = marker;

            google.maps.event.addListener(marker, 'click', function() {
                mapView.showOfficePopup(this);
            });
        },

        addGeoMarker: function(geolocation) {
            var location = geolocation.get('geometry').location
            var mapView = this;
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(location.lb, location.mb),
                map: this.map,
                geolocation: geolocation,
                icon: new PinImage('efefef')
            });

            geolocation.marker = marker;

            google.maps.event.addListener(marker, 'click', function() {
                mapView.showOfficePopup(this);
            });
        },

        mapGeolocations: function(geolocations) {
            _.each(geolocations.models, this.addGeoMarker);
        },

        showOfficePopup: function(marker) {
            this.popup = new OfficePopup({model: marker.office});
            this.infowindow.setContent(this.popup.render().el);
            this.infowindow.open(this.map, marker);
        },

        zoom: function(position, zoom) {
            this.map.setCenter(position);
            this.map.setZoom(15);
        },

        home: function() {
            this.map.setCenter(this.mapOptions.center);
            this.map.setZoom(this.mapOptions.zoom);
        },

        focusOffice: function(office){
            new gmaps.event.trigger(office.marker, 'click');
        },

        focusGeolocation: function(geolocation){
            new gmaps.event.trigger(geolocation.marker, 'click');
        }
    });

    return MapView;
});
