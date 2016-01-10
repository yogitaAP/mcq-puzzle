//Backbone model for question
var app = app || {};

(function () {
	'use strict';

	app.Question = Backbone.Model.extend({
		// Default attributes for the question model
		defaults: {
			index: null,
			attempted: false,
                        score: 0,
                        question : {},
                        answer: {},
                        options: {},
                        response: 1
		}
        });
})();
