/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {
	'use strict';

	app.AppView = Backbone.View.extend({

            el: '.mcqapp',

            appViewTemplate: _.template($('#appview-template').html()),

            helpTemplate: _.template($('#help-template').html()),

            resultTemplate: _.template($('#result-template').html()),

            initialize: function () {
                    this.$el.find('.content').append(this.appViewTemplate);
                    
                    //caching DOM elements of action buttons
                    this.startButtonEle = this.$el.find('#start');
                    this.helpButtonEle = this.$el.find('#help');
                    this.prevButtonEle = this.$el.find('#previous');
                    this.nextButtonEle = this.$el.find('#next');
                    this.homeButtonEle = this.$el.find('#home');
                    this.finishButtonEle = this.$el.find('#finish');
            },

            render: function () {

            },
            
            renderOnlyHomeButton: function() {
                this.$el.find('#top-title').hide();
                this.startButtonEle.addClass('hidden');
                this.helpButtonEle.addClass('hidden');
                this.nextButtonEle.addClass('hidden');
                this.prevButtonEle.addClass('hidden');
                this.finishButtonEle.addClass('hidden');
                this.homeButtonEle.removeClass('hidden');
            },
                
            customisePageSection: function(option) {
                if(option === 'questions') {
                    this.$el.find('#top-title').hide();
                    this.startButtonEle.addClass('hidden');
                    this.helpButtonEle.addClass('hidden');
                    this.prevButtonEle.removeClass('hidden');
                    this.nextButtonEle.removeClass('hidden');
                } else if(option === 'results') {
                    this.$el.find('#top-title').hide();
                    this.renderOnlyHomeButton();
                } else if(option === 'help') {
                    this.renderOnlyHomeButton();
                } else if(option === 'home') {
                    this.$el.find('#top-title').show();
                    this.startButtonEle.removeClass('hidden');
                    this.helpButtonEle.removeClass('hidden');
                    this.nextButtonEle.addClass('hidden');
                    this.prevButtonEle.addClass('hidden');
                    this.finishButtonEle.removeClass('hidden');
                    this.homeButtonEle.addClass('hidden');
                }
            },

            renderQuestionsSection: function(index) {
                index = typeof index !== 'undefined' ? index : 0;
                var question = app.questions.models[index];
                var questionView = new app.QuestionView({model: question});
                var storedResponse = question.get('response');
                if(this.$el.find('#main').children().length)
                    this.$el.find('#main > div').replaceWith(questionView.render().$el);
                else
                    this.$el.find('#main').append(questionView.render().$el);
                questionView.$el.find('input#' + index + '-' + storedResponse).attr('checked', true);
            },

            renderHelpSection: function() {
                if(this.$el.find('#main').children().length)
                    this.$el.find('#main > div').replaceWith(this.helpTemplate);
                else
                    this.$el.find('#main').append(this.helpTemplate);

            },

            renderResultsSection: function() {
                var data = {
                   attempted : 0,
                   correct : 0,
                   incorrect:0,
                   totalScore: 0,
                   unattempted : 0
                };


                for(var i = 0; i < app.questions.length; ++i) {
                    var score = app.questions.models[i].get('score');
                    data.totalScore += score;
                    if(score !== 0)
                        data.attempted += 1;
                    if(score === 0)
                        data.unattempted += 1;
                    if(score === 5)
                        data.correct += 1;
                    if(score === -3)
                        data.incorrect += 1;
                }


                if(this.$el.find('#main').children().length)
                    this.$el.find('#main > div').replaceWith(this.resultTemplate(data));
                else
                    this.$el.find('#main').append(this.resultTemplate(data));
            },

            renderHomeSection: function() {
                this.$el.find('#main > div').remove();
            },

            events: {
                    'click #start': 'onClickStart',
                    'click #finish': 'onClickFinish',
                    'click #help': 'onClickHelp',
                    'click #home': 'onClickHome',
                    'click #previous': 'onClickPrev',
                    'click #next': 'onClickNext',
                    'click input': 'onClickAnswer'
            },

            onClickAnswer: function(event) {
                var that = this;
                var inputId = parseInt($(event.target).closest('.options-text').siblings('.question-text').attr('id'));
                if(inputId < app.questions.length - 1) {
                    setTimeout(function() {
                        that.renderQuestionsSection(inputId + 1);
                    }, 500);
                } else {
                    this.onClickFinish();
                }
            },

            onClickStart: function() {
                app.questions.models.forEach(function(model){
                    model.set('response', 1);
                });
                this.renderQuestionsSection();
                this.customisePageSection('questions');
                return false;

            },

            onClickFinish: function() {
                this.renderResultsSection();
                this.customisePageSection('results');
                return false;
            },

            onClickHelp: function() {
                this.renderHelpSection();
                this.customisePageSection('help');
                return false;
            },

            onClickHome: function() {
                this.renderHomeSection();
                this.customisePageSection('home');
                return false;
            },

            onClickNext: function() {
                var questionIndex = parseInt(this.$el.find('.question-text').attr('id'));
                if(questionIndex < app.questions.length - 1) {
                    this.renderQuestionsSection(questionIndex + 1);
                } else {
                    this.renderResultsSection();
                    this.customisePageSection('results');
                }
            },

            onClickPrev: function() {
                var questionIndex = parseInt(this.$el.find('.question-text').attr('id'));
                if((questionIndex === 0)) {
                    this.renderHomeSection();
                    this.customisePageSection('home');
                } else {
                    this.renderQuestionsSection(questionIndex - 1);
                }
            },

            updateUrl: function() {
                //if routes hash exists and is used this methid will help updating the URL.
            }

	});
})(jQuery);


