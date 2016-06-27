module.export = function(config, helpers) {
    //Defines BBCode tags
    var BBTag = require('bbcode-parser/bTag');
    var bbTags = [];

    //Text modifiers
    bbTags["b"] = new BBTag("b", true, false, false);
    bbTags["i"] = new BBTag("i", true, false, false);
    bbTags["u"] = new BBTag("u", true, false, false);
    bbTags["s"] = new BBTag("s", true, false, false);

    //Useless?
    bbTags["text"] = new BBTag("text", true, false, true, function(tag, content, attr) {
        return content;
    });

    //Font size
    bbTags["size"] = new BBTag("size", true, false, false, function(tag, content, attr) {
        return '<span style="font-size:' + attr + '">' + content + '</font>';
    });

    //Font color
    bbTags["color"] = new BBTag("color", true, false, false, function(tag, content, attr) {
        return '<span style="color:' + attr + '">' + content + '</font>';
    });

    //Text align : center
    bbTags["center"] = new BBTag("center", true, false, false, function(tag, content, attr) {
        return '<div style="text-align:center">' + content + '</div>';
    });


    //Quote
    bbTags["quote"] = new BBTag("quote", true, true, false, function(tag, content, attr) {
        return '<blockquote><p>' + content + '</p></blockquote>';
    });

    //Un-ordered list
    bbTags["list"] = new BBTag("ul", true, true, false, function(tag, content, attr) {
        return '<ul>' + content + '</ul>';
    });

    //Ordered list
    bbTags["ol"] = new BBTag("ul", true, true, false, function(tag, content, attr) {
        return '<ol>' + content + '</ol>';
    });

    //List item
    bbTags["li"] = new BBTag("li", true, false, false, function(tag, content, attr) {
        return '<li>' + content + '</li>';
    });

    //Shorthand for list item
    bbTags["*"] = bbTags["li"];


    //Image
    bbTags["img"] = new BBTag("img", true, false, false, function(tag, content, attr) {
        if(!helpers.isUrlValid(content))
            return '';

        return '<img class="img-responsive img-markdown" src="' + content + '" />';
    });

    //Link
    bbTags["url"] = new BBTag("url", true, false, false, function(tag, content, attr) {
        var link = content;

        if (attr["url"] != undefined) {
            link = escapeHTML(attr["url"]);
        }

        if (!startsWith(link, "http://") && !startsWith(link, "https://")) {
            link = "http://" + link;
        }

        return '<a href="' + link + '"' +
                (helpers.isExternalLink(link) ? 
                    (config.externalBlank ? ' target="_blank"' : '') +
                    (config.nofollow ? ' rel="nofollow"' : '')
                : '') +
                '>' + content + '</a>';
    });

    //Code highlighting
    bbTags["code"] = new BBTag("code", true, false, true, function(tag, content, attr) {
        var lang = attr["lang"];

        if (lang !== undefined) {
            return "<code class=\"" + escapeHTML(lang) + "\">" + content + "</code>";
        } else {
            return "<code>" + content + "</code>";
        }
    });

    var bbCode = new BBCodeParser(bbTags);

    return {
        render: function(raw) {
            return bbCode.parseString(raw, false);
        }
    };
}
