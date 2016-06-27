"use strict";
/* global hljs, RELATIVE_PATH, require, config */

$(document).ready(function() {
	var Markdown = {};

	$(window).on('action:composer.enhanced', function() {
		Markdown.prepareFormattingTools();
	});

	Markdown.highlight = function(data) {
		if (data instanceof jQuery.Event) {
			highlight($(data.data.selector));
		} else {
			highlight(data);
		}
	};

	Markdown.prepareFormattingTools = function() {
		require([
			'composer/formatting',
			'composer/controls',
			'translator'
		], function(formatting, controls, translator) {
			if (formatting && controls) {
				translator.getTranslations(window.config.userLang || window.config.defaultLang, 'bbcode-parser', function(strings) {
					formatting.addButtonDispatch('bold', function(textarea, selectionStart, selectionEnd){
						if(selectionStart === selectionEnd){
							controls.insertIntoTextarea(textarea, '[b]' + strings.bold + '[/b]');
							controls.updateTextareaSelection(textarea, selectionStart + 2, selectionStart + strings.bold.length + 2);
						} else {
							controls.wrapSelectionInTextareaWith(textarea, '[b]','[/b]');
							controls.updateTextareaSelection(textarea, selectionStart + 2, selectionEnd + 2);
						}
					});

					formatting.addButtonDispatch('italic', function(textarea, selectionStart, selectionEnd){
						if(selectionStart === selectionEnd){
							controls.insertIntoTextarea(textarea, '[i]' + strings.italic + '[/i]');
							controls.updateTextareaSelection(textarea, selectionStart + 1, selectionStart + strings.italic.length + 1);
						} else {
							controls.wrapSelectionInTextareaWith(textarea, '[i]', '[/i]');
							controls.updateTextareaSelection(textarea, selectionStart + 1, selectionEnd + 1);
						}
					});

					formatting.addButtonDispatch('list', function(textarea, selectionStart, selectionEnd){
						if(selectionStart === selectionEnd){
							controls.insertIntoTextarea(textarea, "[ul]\n[li]" + strings.list_item + "[/li]\n[/ul]");

							// Highlight "list item"
							controls.updateTextareaSelection(textarea, selectionStart + 3, selectionStart + strings.list_item.length + 3);
						} else {
							controls.wrapSelectionInTextareaWith(textarea, '[ul]\n[li]', '[/li]\n[/ul]');
							controls.updateTextareaSelection(textarea, selectionStart + 3, selectionEnd + 3);
						}
					});

					formatting.addButtonDispatch('strikethrough', function(textarea, selectionStart, selectionEnd){
						console.log(strings);
						if(selectionStart === selectionEnd){
							controls.insertIntoTextarea(textarea, "[s]" + strings.strikethrough_text + "[/s]");
							controls.updateTextareaSelection(textarea, selectionStart + 2, selectionEnd + strings.strikethrough_text.length + 2);
						} else {
							controls.wrapSelectionInTextareaWith(textarea, '[s]', '[/s]');
							controls.updateTextareaSelection(textarea, selectionStart + 2, selectionEnd + 2);
						}
					});

					formatting.addButtonDispatch('link', function(textarea, selectionStart, selectionEnd){
						if(selectionStart === selectionEnd){
							controls.insertIntoTextarea(textarea, "[url=" + strings.link_url + "]" + strings.link_text + '[/url]');

							// Highlight "link url"
							controls.updateTextareaSelection(textarea, selectionStart + strings.link_text.length + 3, selectionEnd + strings.link_text.length + strings.link_url.length + 3);
						} else {
							controls.wrapSelectionInTextareaWith(textarea, "[url=" + strings.link_url + "]", '[/url]');

							// Highlight "link url"
							controls.updateTextareaSelection(textarea, selectionEnd + 3, selectionEnd + strings.link_url.length + 3);
						}
					});

					formatting.addButtonDispatch('image', function(textarea, selectionStart, selectionEnd){
						if(selectionStart === selectionEnd){
							controls.insertIntoTextarea(textarea, "[img=" + strings.image_url + "]" + strings.image_text + "[/img]");

							// Highlight "image url"
							controls.updateTextareaSelection(textarea, selectionStart + strings.image_text.length + 4, selectionEnd + strings.image_text.length + strings.image_url.length + 4);
						} else {
							controls.wrapSelectionInTextareaWith(textarea, "[img=" + strings.image_url + "]", "[/img]");

							// Highlight "image url"
							controls.updateTextareaSelection(textarea, selectionEnd + 4, selectionEnd + strings.image_url.length + 4);
						}

					});

					formatting.addButtonDispatch('underline', function(textarea, selectionStart, selectionEnd){
						if(selectionStart === selectionEnd){
							controls.insertIntoTextarea(textarea, '[u]' + strings.underline_text + '[/u]');
							controls.updateTextareaSelection(textarea, selectionStart + 2, selectionStart + strings.underline_text.length + 2);
						} else {
							controls.wrapSelectionInTextareaWith(textarea, '[u]','[/u]');
							controls.updateTextareaSelection(textarea, selectionStart + 2, selectionEnd + 2);
						}
					});

					formatting.addButtonDispatch('size', function(textarea, selectionStart, selectionEnd){
						if(selectionStart === selectionEnd){
							controls.insertIntoTextarea(textarea, '[size= ' + strings.size +']' + strings.size_text + '[/size]');
							controls.updateTextareaSelection(textarea, selectionStart + 2, selectionStart + strings.size_text.length + 2);
						} else {
							controls.wrapSelectionInTextareaWith(textarea, '[size=12]','[/size]');
							controls.updateTextareaSelection(textarea, selectionStart + 2, selectionEnd + 2);
						}
					});

					formatting.addButtonDispatch('color', function(textarea, selectionStart, selectionEnd){
						if(selectionStart === selectionEnd){
							controls.insertIntoTextarea(textarea, '[color= ' + strings.color + ']' + strings.color_text + '[/color]');
							controls.updateTextareaSelection(textarea, selectionStart + 2, selectionStart + strings.color_text.length + 2);
						} else {
							controls.wrapSelectionInTextareaWith(textarea, '[color]','[/color]');
							controls.updateTextareaSelection(textarea, selectionStart + 2, selectionEnd + 2);
						}
					});

					formatting.addButtonDispatch('code', function(textarea, selectionStart, selectionEnd){
						if(selectionStart === selectionEnd){
							controls.insertIntoTextarea(textarea, '[code lang=' + strings.code_lang + ']' + strings.code_text + '[/code]');
							controls.updateTextareaSelection(textarea, selectionStart + 2, selectionStart + strings.code_text.length + 2);
						} else {
							controls.wrapSelectionInTextareaWith(textarea, '[code lang=' + strings.code_lang + ']','[/code]');
							controls.updateTextareaSelection(textarea, selectionStart + 2, selectionEnd + 2);
						}


					});

					formatting.addButtonDispatch('center', function(textarea, selectionStart, selectionEnd){
						if(selectionStart === selectionEnd){
							controls.insertIntoTextarea(textarea, '[center]' + strings.center + '[/center]');
							controls.updateTextareaSelection(textarea, selectionStart + 2, selectionStart + strings.center.length + 2);
						} else {
							controls.wrapSelectionInTextareaWith(textarea, '[center]','[/center]');
							controls.updateTextareaSelection(textarea, selectionStart + 2, selectionEnd + 2);
						}
					});
				})
			}
		});
	};

	function highlight(elements) {
		if (parseInt(config['bbcode-parser'].highlight, 10)) {
			require(['highlight'], function(hljs) {
				elements.each(function(i, block) {
					$(block.parentNode).addClass('bbcode-highlight');
					hljs.highlightBlock(block);
				});
			});
		}
	}

	$(window).on('action:composer.preview', {
		selector: '.composer .preview pre code'
	}, Markdown.highlight);


	require(['components'], function(components) {
		$(window).on('action:posts.loaded action:topic.loaded action:posts.edited', function() {
			Markdown.highlight(components.get('post/content').find('pre code'));
		});
	});
});
