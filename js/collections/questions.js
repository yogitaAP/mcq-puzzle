//Backbone Collection for Questions
var app = app || {};

(function () {
	'use strict';

	var Questions = Backbone.Collection.extend({
		model: app.Question
        });
        
        app.questions = new Questions();    //instantiaitng questions collection      
        
        $.get('resources/problem.txt').then(function(response) {
            var data = JSON.parse(response);
            for(var i = 0; i < data.length; i++) {
                var question = new app.Question({
                                    index: i,
                                    question: data[i].text,
                                    options: data[i].options,
                                    answer: data[i].answer
                                });

                app.questions.add(question);        //populating queston collection with pulled data        
            }
        });
})();
