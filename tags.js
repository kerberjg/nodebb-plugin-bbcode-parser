module.exports = function(config, helpers) {
    //Defines BBCode tags
    var BBCodeParser = require('bbcode-parser');
    var BBTag = require('bbcode-parser/bbTag');
    var escapeHTML = BBCodeParser.escapeHTML;
    var bbTags = [];

    //Text modifiers
    bbTags["b"] = new BBTag("b", true, false, false);
    bbTags["i"] = new BBTag("i", true, false, false);
    bbTags["u"] = new BBTag("u", true, false, false);
    bbTags["s"] = new BBTag("s", true, false, false);

    //Font size
    bbTags["size"] = new BBTag("size", true, false, false, function(tag, content, attr) {
        return '<span style="font-size:' +
                escapeHTML(attr['size'] || '') + '">' +
                content + '</span>';
    });

    //Font color
    bbTags["color"] = new BBTag("color", true, false, false, function(tag, content, attr) {
        return '<span style="color:' +
                escapeHTML(attr['color'] || '') + '">' +
                content + '</span>';
    });

    //Text align : center
    bbTags["center"] = new BBTag("center", true, false, false, function(tag, content, attr) {
        return '<div class="text-center">' + content + '</div>';
    });


    //Quote
    bbTags["quote"] = new BBTag("quote", true, true, false, function(tag, content, attr) {
        return '<blockquote><p>' + content + '</p></blockquote>';
    });

    //Un-ordered list
    bbTags["list"] = new BBTag("list", true, true, false, function(tag, content, attr) {
        return '<ul>' + content + '</ul>';
    });

    bbTags["ul"] = new BBTag("ul", true, true, false, function(tag, content, attr) {
        return '<ul>' + content + '</ul>';
    });

    //Ordered list
    bbTags["ol"] = new BBTag("ol", true, true, false, function(tag, content, attr) {
        return '<ol>' + content + '</ol>';
    });

    //List item
    bbTags["li"] = new BBTag("li", true, false, false, function(tag, content, attr) {
        return '<li>' + content + '</li>';
    });

    //Image
    bbTags["img"] = new BBTag("img", true, false, false, function(tag, content, attr) {
        if(!helpers.isUrlValid(content))
            return '';

        return '<img class="img-responsive img-markdown" src="' + escapeHTML(content || '') + '" />';
    });

    //Link
    bbTags["url"] = new BBTag("url", true, false, false, function(tag, content, attr) {
        var link = '';

        if (attr["url"] != undefined)
            link = attr["url"];
        else
            link = content;

        return '<a href="' + escapeHTML(link) + '"' +
                (helpers.isExternalLink(link) ? 
                    (config.externalBlank ? ' target="_blank"' : '') +
                    (config.nofollow ? ' rel="nofollow"' : '')
                : '') +
                '>' + content + '</a>';
    });

    //Code highlighting
    bbTags["code"] = new BBTag("code", true, false, true, function(tag, content, attr) {
        var lang = attr["lang"];

        return '<pre><code class="' +
                (lang ? config.langPrefix + escapeHTML(lang || '') : '') +
                '">' + escapeHTML(content) +
                '</code></pre>';
    });

    var bbCode = new BBCodeParser(bbTags);

    return {
        render: function(raw) {
            return bbCode.parseString(raw);
        }
    };
}
