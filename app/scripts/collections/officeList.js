/*global define*/

define([
    'underscore',
    'backbone',
    'models/office',
    'backbone.sharepoint'
], function (_, Backbone, OfficeModel, SP) {
    'use strict';

    var OfficelistCollection = SP.List.extend({
        model: OfficeModel
    });

    return OfficelistCollection;
});
