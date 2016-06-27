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
							controls.updateTextareaSelection(textarea, selectionStart + 3, selectionStart + strings.bold.length + 3);
						} else {
							controls.wrapSelectionInTextareaWith(textarea, '[b]','[/b]');
							controls.updateTextareaSelection(textarea, selectionStart + 3, selectionEnd + 3);
						}
					});

					formatting.addButtonDispatch('italic', function(textarea, selectionStart, selectionEnd){
						if(selectionStart === selectionEnd){
							controls.insertIntoTextarea(textarea, '[i]' + strings.italic + '[/i]');
							controls.updateTextareaSelection(textarea, selectionStart + 3, selectionStart + strings.italic.length + 3);
						} else {
							controls.wrapSelectionInTextareaWith(textarea, '[i]', '[/i]');
							controls.updateTextareaSelection(textarea, selectionStart + 3, selectionEnd + 3);
						}
					});

					formatting.addButtonDispatch('list', function(textarea, selectionStart, selectionEnd){
						if(selectionStart === selectionEnd){
							controls.insertIntoTextarea(textarea, "[list]\n[li]" + strings.list_item + "[/li]\n[/list]");

							// Highlight "list item"
							controls.updateTextareaSelection(textarea, selectionStart + 12, selectionStart + strings.list_item.length + 12);
						} else {
							controls.wrapSelectionInTextareaWith(textarea, '[list]\n[li]', '[/li]\n[/list]');
							controls.updateTextareaSelection(textarea, selectionStart + 12, selectionEnd + 12);
						}
					});

					formatting.addButtonDispatch('strikethrough', function(textarea, selectionStart, selectionEnd){
						console.log(strings);
						if(selectionStart === selectionEnd){
							controls.insertIntoTextarea(textarea, "[s]" + strings.strikethrough_text + "[/s]");
							controls.updateTextareaSelection(textarea, selectionStart + 3, selectionEnd + strings.strikethrough_text.length + 3);
						} else {
							controls.wrapSelectionInTextareaWith(textarea, '[s]', '[/s]');
							controls.updateTextareaSelection(textarea, selectionStart + 3, selectionEnd + 3);
						}
					});

					formatting.addButtonDispatch('link', function(textarea, selectionStart, selectionEnd){
						if(selectionStart === selectionEnd){
							controls.insertIntoTextarea(textarea, '[url="' + strings.link_url + '"]' + strings.link_text + '[/url]');

							// Highlight "link url"
							controls.updateTextareaSelection(textarea, selectionStart + strings.link_text.length + 3, selectionEnd + strings.link_text.length + strings.link_url.length + 3);
						} else {
							controls.wrapSelectionInTextareaWith(textarea, '[url="' + strings.link_url + '"]', '[/url]');

							// Highlight "link url"
							controls.updateTextareaSelection(textarea, selectionEnd + 5, selectionEnd + strings.link_url.length + 5);
						}
					});

					formatting.addButtonDispatch('image', function(textarea, selectionStart, selectionEnd){
						if(selectionStart === selectionEnd){
							controls.insertIntoTextarea(textarea, '[img]' + strings.image_url + '[/img]');

							// Highlight "image url"
							controls.updateTextareaSelection(textarea, selectionStart + strings.image_text.length + 5, selectionEnd + strings.image_text.length + strings.image_url.length + 4);
						} else {
							controls.wrapSelectionInTextareaWith(textarea, "[img]", "[/img]");

							// Highlight "image url"
							controls.updateTextareaSelection(textarea, selectionEnd + 5, selectionEnd + strings.image_url.length + 5);
						}

					});

					formatting.addButtonDispatch('underline', function(textarea, selectionStart, selectionEnd){
						if(selectionStart === selectionEnd){
							controls.insertIntoTextarea(textarea, '[u]' + strings.underline_text + '[/u]');
							controls.updateTextareaSelection(textarea, selectionStart + 3, selectionStart + strings.underline_text.length + 3);
						} else {
							controls.wrapSelectionInTextareaWith(textarea, '[u]','[/u]');
							controls.updateTextareaSelection(textarea, selectionStart + 3, selectionEnd + 3);
						}
					});

					formatting.addButtonDispatch('size', function(textarea, selectionStart, selectionEnd){
						if(selectionStart === selectionEnd){
							controls.insertIntoTextarea(textarea, '[size="' + strings.size +'"]' + strings.size_text + '[/size]');
							controls.updateTextareaSelection(textarea, selectionStart + 7, selectionStart + strings.size_text.length + 7);
						} else {
							controls.wrapSelectionInTextareaWith(textarea, '[size="' + strings.size +'"]','[/size]');
							controls.updateTextareaSelection(textarea, selectionStart + 8, selectionEnd + 8);
						}
					});

					formatting.addButtonDispatch('color', function(textarea, selectionStart, selectionEnd){
						if(selectionStart === selectionEnd){
							controls.insertIntoTextarea(textarea, '[color="' + strings.color + '"]' + strings.color_text + '[/color]');
							controls.updateTextareaSelection(textarea, selectionStart + 8, selectionStart + strings.color_text.length + 8);
						} else {
							controls.wrapSelectionInTextareaWith(textarea, '[color="' + strings.color + '"]','[/color]');
							controls.updateTextareaSelection(textarea, selectionStart + 13, selectionEnd + 13);
						}
					});

					formatting.addButtonDispatch('code', function(textarea, selectionStart, selectionEnd){
						if(selectionStart === selectionEnd){
							controls.insertIntoTextarea(textarea, '[code lang="' + strings.code_lang + '"]' + strings.code_text + '[/code]');
							controls.updateTextareaSelection(textarea, selectionStart + 2, selectionStart + strings.code_text.length + 2);
						} else {
							controls.wrapSelectionInTextareaWith(textarea, '[code lang="' + strings.code_lang + '"]','[/code]');
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
