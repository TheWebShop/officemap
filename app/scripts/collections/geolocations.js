/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'gmaps',
    'models/geolocation'
], function ($, _, Backbone, gmaps, GeolocationModel) {
    'use strict';
    var GeocoderStatusDescription = {
        "OK": "The request did not encounter any errors",
        "UNKNOWN_ERROR": "A geocoding or directions request could not be successfully processed, yet the exact reason for the failure is not known",
        "OVER_QUERY_LIMIT": "The webpage has gone over the requests limit in too short a period of time",
        "REQUEST_DENIED": "The webpage is not allowed to use the geocoder for some reason",
        "INVALID_REQUEST": "This request was invalid",
        "ZERO_RESULTS": "The request did not encounter any errors but returns zero results",
        "ERROR": "There was a problem contacting the Google servers"
    };
    var GeocoderLocationTypeDescription = {
        "ROOFTOP": "The returned result reflects a precise geocode.",
        "RANGE_INTERPOLATED": "The returned result reflects an approximation (usually on a road) interpolated between two precise points (such as intersections).",
        "GEOMETRIC_CENTER": "The returned result is the geometric center of a result such a line (e.g. street) or polygon (region).",
        "APPROXIMATE": "The returned result is approximate."
    }

    var GeolocationsCollection = Backbone.Collection.extend({
        geocoder: new gmaps.Geocoder(),
        model: GeolocationModel,
        fetch : function(query) {
            var dfd = new $.Deferred();
            var geolocationsCollection = this;
            // BC bounds from api demo http://gmaps-samples-v3.googlecode.com/svn/trunk/geocoder/v3-geocoder-tool.html#q%3Dbc%20canada
            var BCsw = new gmaps.LatLng(48.308959, -139.05707);
            var BCne = new gmaps.LatLng(60.000149, -114.054221);
            var BCbounds = new gmaps.LatLngBounds(BCsw, BCne);

            var request = {
                address: query,
                bounds: BCbounds
            };

            this.geocoder.geocode(request, function(results, status){
                if(status === 'OK'){
                    geolocationsCollection.reset(results);
                    dfd.resolve(geolocationsCollection);
                }else {
                    throw status;
                }
            });
            return dfd;
        }
    });

    return GeolocationsCollection;
});
