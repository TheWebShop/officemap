/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'gmaps'
], function ($, _, Backbone, gmaps) {
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
                position: google.maps.ControlPosition.BOTTOM_CENTER
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
            this.map = new google.maps.Map(this.el, this.mapOptions);

            _.bindAll(this, 'addOfficeMarker');
        },

        addOfficeMarker: function(office) {
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(office.get('Latitude'), office.get('Longitude')),
                map: this.map,
                //icon: office.icon,
                office: office
            });
        }
    });

    return MapView;
});
