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

    var MapView = Backbone.View.extend({

        el: $("#map")[0],

        $el: $("#map"),

        mapOptions: {
            center: new google.maps.LatLng(53.7266683, -127.64762059999998),
            zoom: 6,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: true,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                position: google.maps.ControlPosition.TOP_CENTER
            },
            panControl: true,
            panControlOptions: {
                position: google.maps.ControlPosition.TOP_RIGHT
            },
            zoomControl: true,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.LARGE,
                position: google.maps.ControlPosition.RIGHT_TOP
            }
        },

        controlTemplate: JST['app/scripts/templates/mapControl.ejs'],

        initialize: function(options) {
            var mapView = this;
            _.bindAll(this, 'addOfficeMarker', 'zoom', 'home');

            this.map = new google.maps.Map(this.el, this.mapOptions);
            this.infowindow = new google.maps.InfoWindow({
                maxWidth: 300
            });

            var leftPanelControl = new MapcontrolView({
                title: 'Click to set show/hide office list',
                text: 'Offices'
            });
            this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(leftPanelControl.el);
            google.maps.event.addDomListener(leftPanelControl.el, 'click', function() {
                vent.trigger('toggle:leftPanel');
            });

            var homeMapControl = new MapcontrolView({
                title: 'Click to zoom out',
                text: 'Home'
            });
            this.map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(homeMapControl.el);
            google.maps.event.addDomListener(homeMapControl.el, 'click', function() {
                vent.trigger('home');
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
        }
    });

    return MapView;
});
