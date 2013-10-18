/*global define*/

// this is a repackaging of underscore's templating engine for use with Twitter's typeahead
// https://github.com/twitter/typeahead.js#template-engine-compatibility

define([
    'underscore'
], function (_) {
    'use strict';

    // by changing the tempalte settings we can ensure it survives the procompile from grunt-contrib-jst
    _.templateSettings = {
        evaluate : /\{\[([\s\S]+?)\]\}/g,
        interpolate : /\{\{([\s\S]+?)\}\}/g
    };

    return {
        compile: function(text) {
            return {
                render: _.template(text)
            };
        }
    };
});
