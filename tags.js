//Defines BBCode tags
var BBTag = require('bbcode-parser/bTag');

var bbTags = {};

//Text modifiers
bbTags["b"] = new BBTag("b", true, false, false);
bbTags["i"] = new BBTag("i", true, false, false);
bbTags["u"] = new BBTag("u", true, false, false);

//Useless?
bbTags["text"] = new BBTag("text", true, false, true, (tag, content, attr) => {
  return content;
});

//Image
bbTags["img"] = new BBTag("img", true, false, false, (tag, content, attr) => {
  return "<img src=\"" + content + "\" />";
});

//Link
bbTags["url"] = new BBTag("url", true, false, false, (tag, content, attr) => {
  var link = content;

  if (attr["url"] != undefined) {
    link = escapeHTML(attr["url"]);
  }

  if (!startsWith(link, "http://") && !startsWith(link, "https://")) {
    link = "http://" + link;
  }

  return "<a href=\"" + link + "\" target=\"_blank\">" + content + "</a>";
});

//Code highlighting
bbTags["code"] = new BBTag("code", true, false, true, (tag, content, attr) => {
  var lang = attr["lang"];

  if (lang !== undefined) {
    return "<code class=\"" + escapeHTML(lang) + "\">" + content + "</code>";
  } else {
    return "<code>" + content + "</code>";
  }
});

module.exports = bbTags;
