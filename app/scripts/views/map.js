/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'gmaps',
    'views/OfficePopup',
    'vent'
], function ($, _, Backbone, gmaps, OfficePopup, vent) {
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

        initialize: function(options) {
            var mapView = this;
            _.bindAll(this, 'addOfficeMarker');

            this.map = new google.maps.Map(this.el, this.mapOptions);
            this.infowindow = new google.maps.InfoWindow({
                maxWidth: 300
            });

            var HomeControl = function(controlDiv, map) {

                // Set CSS styles for the DIV containing the control
                // Setting padding to 5 px will offset the control
                // from the edge of the map
                controlDiv.style.padding = '5px';

                // Set CSS for the control border
                var controlUI = document.createElement('div');
                controlUI.style.backgroundColor = 'white';
                controlUI.style.borderStyle = 'solid';
                controlUI.style.borderWidth = '2px';
                controlUI.style.cursor = 'pointer';
                controlUI.style.textAlign = 'center';
                controlUI.title = 'Click to set the map to Home';
                controlDiv.appendChild(controlUI);

                // Set CSS for the control interior
                var controlText = document.createElement('div');
                controlText.style.fontFamily = 'Arial,sans-serif';
                controlText.style.fontSize = '12px';
                controlText.style.paddingLeft = '4px';
                controlText.style.paddingRight = '4px';
                controlText.innerHTML = '<b>Offices</b>';
                controlUI.appendChild(controlText);

                google.maps.event.addDomListener(controlUI, 'click', function() {
                    vent.trigger('toggle:leftPanel');
                });

            }

            // Create the DIV to hold the control and
            // call the HomeControl() constructor passing
            // in this DIV.
            var homeControlDiv = document.createElement('div');
            var homeControl = new HomeControl(homeControlDiv, this.map);

            homeControlDiv.index = 1;
            this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(homeControlDiv);
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
                vent.trigger('toggle:leftPanel');
            });
        },

        showOfficePopup: function(marker) {
            this.popup = new OfficePopup({model: marker.office});
            this.infowindow.setContent(this.popup.render().el);
            this.infowindow.open(this.map, marker);
        }
    });

    return MapView;
});
