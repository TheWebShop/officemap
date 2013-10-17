/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
], function ($, _, Backbone, JST) {
    'use strict';

    var OfficepopupView = Backbone.View.extend({
        template: JST['app/scripts/templates/officePopup.ejs'],

        className: 'gmap-popup',

        render: function() {
            $(this.el).html(this.template(this.model.attributes));

            return this;
        }
    });

    return OfficepopupView;
});
