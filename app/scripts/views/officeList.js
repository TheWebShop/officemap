/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'vent'
], function ($, _, Backbone, JST, vent) {
    'use strict';

    var OfficeListView = Backbone.View.extend({
        template: JST['app/scripts/templates/officeList.ejs'],

        el: $('#office-list')[0],

        $el: $('#office-list'),

        events: {
            'click .office': 'focusOffice'
        },

        initialize: function(options) {
            _.extend(this, options);
            _.bindAll(this, 'render');
        },

        render: function() {
            $(this.el).html(this.template({offices:  this.offices.toJSON()}))
                .fadeIn();
        },

        hide: function() {
            this.$el.hide();
        },

        focusOffice: function(e){
            var $target = $(e.target);
            var id = $target.data('officelist-id');
            var model = this.offices.get(id);

            vent.trigger('focus:marker', model);
        }
    });

    return OfficeListView;
});
