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

        events: {
            'click .office': 'focusOffice'
        },

        initialize: function(options) {
            _.extend(this, options);
            _.bindAll(this, 'render');
        },

        render: function() {
            $(this.el).html(this.template({offices:  this.offices.toJSON()}));
        },

        focusOffice: function(e){
            var $target = $(e.target);
            var id = $target.data('officelist-id');
            var office = this.offices.get(id);

            new google.maps.event.trigger(office.marker, 'click');
        }
    });

    return OfficeListView;
});
