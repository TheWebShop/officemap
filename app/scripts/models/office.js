/*global define*/

define([
    'underscore',
    'backbone',
    'backbone.sharepoint'
], function (_, Backbone, SP) {
    'use strict';

    var OfficeModel = SP.Item.extend({
        site: '/RSD',
        list: 'Offices',
        initialize: function() {
            var url = this.get('Website') || '';
            this.set('url', url.replace(/, .*/, ''));
        }
    });

    return OfficeModel;
});
