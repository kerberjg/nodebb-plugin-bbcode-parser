(function() {
	"use strict";

	var	fs = require('fs'),
		path = require('path'),
		url = require('url');

	var	meta = module.parent.require('./meta'),
		nconf = module.parent.require('nconf'),
		translator = module.parent.require('../public/src/modules/translator'),
		plugins = module.parent.exports;

	var	parser,
		BBCodeParser = {
			config: {},
			onLoad: function(params, callback) {
				function render(req, res, next) {
					res.render('admin/plugins/bbcode-parser', {
						themes: BBCodeParser.themes
					});
				}

				params.router.get('/admin/plugins/bbcode-parser', params.middleware.admin.buildHeader, render);
				params.router.get('/api/admin/plugins/bbcode-parser', render);

				BBCodeParser.init();
				BBCodeParser.loadThemes();

				callback();
			},

			getConfig: function(config, callback) {
				config['bbcode-parser'] = {
					highlight: BBCodeParser.highlight ? 1 : 0,
					theme: BBCodeParser.config.highlightTheme || 'railscasts.css'
				};
				callback(null, config);
			},

			getLinkTags: function(links, callback) {
				links.push({
					rel: "stylesheet",
					type: "",
					href: nconf.get('relative_path') + '/plugins/nodebb-plugin-bbcode-parser/styles/' + (BBCodeParser.config.highlightTheme || 'railscasts.css')
				});
				callback(null, links);
			},

			init: function() {
				// Load saved config
				var	_self = this,
					fields = [
						'html', 'xhtmlOut', 'breaks', 'langPrefix', 'linkify', 'typographer', 'externalBlank', 'nofollow'
					],
					defaults = {
						'html': false,
						'xhtmlOut': true,
						'breaks': true,
						'langPrefix': 'language-',
						'linkify': true,
						'typographer': false,
						'highlight': true,
						'highlightTheme': 'railscasts.css',
						'externalBlank': false,
						'nofollow': true
					};

				meta.settings.get('bbcode-parser', function(err, options) {
					for(var field in defaults) {
						// If not set in config (nil)
						if (!options.hasOwnProperty(field)) {
							_self.config[field] = defaults[field];
						} else {
							if (field !== 'langPrefix' && field !== 'highlightTheme' && field !== 'headerPrefix') {
								_self.config[field] = options[field] === 'on' ? true : false;
							} else {
								_self.config[field] = options[field];
							}
						}
					}

					_self.highlight = _self.config.highlight;
					delete _self.config.highlight;

					parser = require('./tags.js')(_self.config, {
						isUrlValid: BBCodeParser.isUrlValid,
						isExternalLink: BBCodeParser.isExternalLink
					});
				});
			},

			loadThemes: function() {
				fs.readdir(path.join(__dirname, 'public/styles'), function(err, files) {
					var isStylesheet = /\.css$/;
					BBCodeParser.themes = files.filter(function(file) {
						return isStylesheet.test(file);
					}).map(function(file) {
						return {
							name: file
						}
					});
				});
			},

			parsePost: function(data, callback) {
				if (data && data.postData && data.postData.content && parser) {
					data.postData.content = parser.render(data.postData.content);
				}
				callback(null, data);
			},

			parseSignature: function(data, callback) {
				if (data && data.userData && data.userData.signature && parser) {
					data.userData.signature = parser.render(data.userData.signature);
				}
				callback(null, data);
			},

			parseAboutMe: function(aboutme, callback) {
				callback(null, (aboutme && parser) ? parser.render(aboutme) : aboutme);
			},

			parseRaw: function(raw, callback) {
				callback(null, (raw && parser) ? parser.render(raw) : raw);
			},
			renderHelp: function(helpContent, callback) {
				translator.translate('[[bbcode-parser:help_text]]', function(translated) {
					plugins.fireHook('filter:parse.raw', '## BBCodeParser\n' + translated, function(err, parsed) {
						helpContent += parsed;
						callback(null, helpContent);
					});
				});
			},

			registerFormatting: function(payload, callback) {
				var formatting = [
					{name: 'bold', className: 'fa fa-bold', title: '[[modules:composer.formatting.bold]]'},
					{name: 'italic', className: 'fa fa-italic', title: '[[modules:composer.formatting.italic]]'},
					{name: 'strikethrough', className: 'fa fa-strikethrough', title: '[[modules:composer.formatting.strikethrough]]'},
					{name: 'underline', className: 'fa fa-underline', title: '[[modules:composer.formatting.underline]]'},

					{name: 'size', className: 'fa fa-text-height', title: '[[modules:composer.formatting.size]]'},
					{name: 'color', className: 'fa fa-paint-brush', title: '[[modules:composer.formatting.color]]'},
					{name: 'center', className: 'fa fa-align-center', title: '[[modules:composer.formatting.center]]'},
					
					{name: 'list', className: 'fa fa-list', title: '[[modules:composer.formatting.list]]'},
					{name: 'image', className: 'fa fa-image', title: '[[modules:composer.formatting.image]]'},
					{name: 'link', className: 'fa fa-link', title: '[[modules:composer.formatting.link]]'},
					{name: 'code', className: 'fa fa-code', title: '[[modules:composer.formatting.code]]'}
				];

				payload.options = formatting.concat(payload.options);

				callback(null, payload);
			},

			isUrlValid: function(src) {
				try {
					var urlObj = url.parse(src, false, true);
					if (urlObj.host === null && !urlObj.pathname.toString().startsWith(nconf.get('relative_path') + nconf.get('upload_url'))) {
						return false;
					} else {
						return true;
					}
				} catch (e) {
					return false;
				}
			},

			isExternalLink: function(urlString) {
				var urlObj = url.parse(urlString),
					baseUrlObj = url.parse(nconf.get('url'));

				if (
					urlObj.host === null ||	// Relative paths are always internal links...
					(urlObj.host === baseUrlObj.host && urlObj.protocol === baseUrlObj.protocol &&	// Otherwise need to check that protocol and host match
					(nconf.get('relative_path').length > 0 ? urlObj.pathname.indexOf(nconf.get('relative_path')) === 0 : true))	// Subfolder installs need this additional check
				) {
					return false;
				} else {
					return true;
				}
			},

			admin: {
				menu: function(custom_header, callback) {
					custom_header.plugins.push({
						"route": '/plugins/bbcode-parser',
						"icon": 'fa-edit',
						"name": 'BBCode Parser'
					});

					callback(null, custom_header);
				}
			}
		};

	module.exports = BBCodeParser;
})();

