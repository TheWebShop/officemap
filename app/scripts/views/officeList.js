/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
], function ($, _, Backbone, JST) {
    'use strict';

    var OfficeListView = Backbone.View.extend({
        template: JST['app/scripts/templates/officeList.ejs'],

        el: $("#office-list")[0],

        $el: $("#office-list"),

        initialize: function(options) {
            _.extend(this, options);
            _.bindAll(this, 'render');
        },

        render: function() {
            $(this.el).html(this.template({offices:  this.offices.toJSON()}));
        }
    });

    return OfficeListView;
});
