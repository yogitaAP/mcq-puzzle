//Backbone View for Question
var app = app || {};

(function ($) {
	'use strict';

	app.QuestionView = Backbone.View.extend({
            tagName:  'div',
            
            template : _.template($('#question-template').html()),

            events: {
                'click input': 'onClickAnswer'
            },
            
            //Handling the user response and updating required data
            
            onClickAnswer: function(event) {
                $(event.target).attr('checked', true);
                var userResponse = parseInt($(event.target).attr('id').split('-')[1]);
                this.model.set('response', userResponse);
                if(userResponse === this.model.get('answer')) {
                    this.model.set('score', 5);
                } else {
                    this.model.set('score', -3);
                }
            },

            initialize: function () {
                
            },

            render: function () {
                this.$el.html(this.template(this.model.toJSON()));
                return this;
            }
	});
        
})(jQuery);