/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
], function ($, _, Backbone, JST) {
    'use strict';

    var MapcontrolView = Backbone.View.extend({
        template: JST['app/scripts/templates/mapControl.ejs'],

        initialize: function(options) {
            _.extend(this, options);
            $(this.el).html(this.template(this));
        }
    });

    return MapcontrolView;
});
