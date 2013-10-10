/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'views/map'
], function ($, _, Backbone, MapView) {
    'use strict';

    var AppView = Backbone.View.extend({

        el: $("#app")[0],

        $el: $("#app"),

        initialize: function() {
            this.gmap = new MapView;

            this.$el.append(this.gmap.render());
        }
    });

    return AppView;
});
