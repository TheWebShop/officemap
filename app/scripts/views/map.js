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
            _.bindAll(this, 'addMarker', 'centerMap', 'centerMapOnMarkers', 'mapGeolocations');

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
            google.maps.event.addDomListener(homeMapControl.el, 'click', this.centerMap);

            vent.on('resize', function() {
                google.maps.event.trigger(mapView.map, 'resize');
            });
        },

        addMarker: function(model, color) {
            var mapView = this;
            var location = model.get('location');
            var opts = {
                position: new google.maps.LatLng(location.lat, location.lng),
                map: this.map,
                model: model
            };
            if(typeof color == 'string') {
                opts.icon = new PinImage(color);
            };
            var marker = new google.maps.Marker(opts);

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
                mapView.addMarker(model, 'efefef');
            });
        },

        showPopup: function(marker) {
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
                this.centerMapOnPosition(markers[0].getPosition());
            }else {
                var bounds = new google.maps.LatLngBounds();
                _.each(markers, function(marker) {
                    this.map.fitBounds(bounds);
                }, this);
                console.log(bounds)
            }
        },

        focusMarker: function(model){
            new gmaps.event.trigger(model.get('marker'), 'click');
        }
    });

    return MapView;
});
