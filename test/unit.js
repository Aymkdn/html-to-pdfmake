var htmlToPdfMake = require('../index.js');
var test = require("simple-test-framework");
var jsdom = require("jsdom");
var { JSDOM } = jsdom;
var { window } = new JSDOM("");

// { text: 'bold word', bold: true, style: [ 'html-b' ] }
test("b",function(t) {
  var ret = htmlToPdfMake("<b>bold word</b>", window);
  t.check(Array.isArray(ret) && ret.length===1, "return is OK");
  ret = ret[0];
  t.check(
    ret.text === "bold word" &&
    ret.bold === true &&
    Array.isArray(ret.style) &&
    ret.style[0] === 'html-b',
  "<b>");

  t.finish();
})

test("strong",function(t) {
  var ret = htmlToPdfMake("<strong>bold word</strong>", window);
  t.check(Array.isArray(ret) && ret.length===1, "return is OK");
  ret = ret[0];
  t.check(
    ret.text === "bold word" &&
    ret.bold === true &&
    Array.isArray(ret.style) &&
    ret.style[0] === 'html-strong',
  "<strong>");

  t.finish();
})

// { text: 'underline word', decoration: 'underline', style: [ 'html-u' ] }
test("u",function(t) {
  var ret = htmlToPdfMake("<u>underline word</u>", window);
  t.check(Array.isArray(ret) && ret.length===1, "return is OK");
  ret = ret[0];
  t.check(
    ret.text === "underline word" &&
    ret.decoration === "underline" &&
    Array.isArray(ret.style) &&
    ret.style[0] === 'html-u',
  "<u>");

  t.finish();
})

test("em",function(t) {
  var ret = htmlToPdfMake("<em>italic word</em>", window);
  t.check(Array.isArray(ret) && ret.length===1, "return is OK");
  ret = ret[0];
  t.check(
    ret.text === "italic word" &&
    ret.italics === true &&
    Array.isArray(ret.style) &&
    ret.style[0] === 'html-em',
  "<em>");

  t.finish();
})

test("i",function(t) {
  var ret = htmlToPdfMake("<i>italic word</i>", window);
  t.check(Array.isArray(ret) && ret.length===1, "return is OK");
  ret = ret[0];
  t.check(
    ret.text === "italic word" &&
    ret.italics === true &&
    Array.isArray(ret.style) &&
    ret.style[0] === 'html-i',
  "<i>");

  t.finish();
})

// [{"text":"level 1","fontSize":24,"bold":true,"marginBottom":5,"style":["html-h1"]}]
test("h1",function(t) {
  var ret = htmlToPdfMake("<h1>level 1</h1>", window);
  t.check(Array.isArray(ret) && ret.length===1, "return is OK");
  ret = ret[0];
  t.check(
    ret.text === "level 1" &&
    ret.fontSize === 24 &&
    ret.bold === true &&
    ret.marginBottom === 5 &&
    Array.isArray(ret.style) &&
    ret.style[0] === 'html-h1',
  "<h1>");

  t.finish();
})

test("h2",function(t) {
  var ret = htmlToPdfMake("<h2>level 2</h2>", window);
  t.check(Array.isArray(ret) && ret.length===1, "return is OK");
  ret = ret[0];
  t.check(
    ret.text === "level 2" &&
    ret.fontSize === 22 &&
    ret.bold === true &&
    ret.marginBottom === 5 &&
    Array.isArray(ret.style) &&
    ret.style[0] === 'html-h2',
  "<h2>");

  t.finish();
})

test("h3",function(t) {
  var ret = htmlToPdfMake("<h3>level 3</h3>", window);
  t.check(Array.isArray(ret) && ret.length===1, "return is OK");
  ret = ret[0];
  t.check(
    ret.text === "level 3" &&
    ret.fontSize === 20 &&
    ret.bold === true &&
    ret.marginBottom === 5 &&
    Array.isArray(ret.style) &&
    ret.style[0] === 'html-h3',
  "<h3>");

  t.finish();
})

test("h4",function(t) {
  var ret = htmlToPdfMake("<h4>level 4</h4>", window);
  t.check(Array.isArray(ret) && ret.length===1, "return is OK");
  ret = ret[0];
  t.check(
    ret.text === "level 4" &&
    ret.fontSize === 18 &&
    ret.bold === true &&
    ret.marginBottom === 5 &&
    Array.isArray(ret.style) &&
    ret.style[0] === 'html-h4',
  "<h4>");

  t.finish();
})

test("h5",function(t) {
  var ret = htmlToPdfMake("<h5>level 5</h5>", window);
  t.check(Array.isArray(ret) && ret.length===1, "return is OK");
  ret = ret[0];
  t.check(
    ret.text === "level 5" &&
    ret.fontSize === 16 &&
    ret.bold === true &&
    ret.marginBottom === 5 &&
    Array.isArray(ret.style) &&
    ret.style[0] === 'html-h5',
  "<h5>");

  t.finish();
})

test("h6",function(t) {
  var ret = htmlToPdfMake("<h6>level 6</h6>", window);
  t.check(Array.isArray(ret) && ret.length===1, "return is OK");
  ret = ret[0];
  t.check(
    ret.text === "level 6" &&
    ret.fontSize === 14 &&
    ret.bold === true &&
    ret.marginBottom === 5 &&
    Array.isArray(ret.style) &&
    ret.style[0] === 'html-h6',
  "<h6>");

  t.finish();
})

// { text: 'link', color: 'blue', decoration: 'underline', link: 'https://www.somewhere.com', style: [ 'html-a' ] }
test("a",function(t) {
  var ret = htmlToPdfMake('<a href="https://www.somewhere.com">link</a>', window);
  t.check(Array.isArray(ret) && ret.length===1, "return is OK");
  ret = ret[0];
  t.check(
    ret.text === "link" &&
    ret.color === "blue" &&
    ret.decoration === "underline" &&
    ret.link === "https://www.somewhere.com" &&
    Array.isArray(ret.style) &&
    ret.style[0] === 'html-a',
  "<a>");

  t.finish();
})

// { text: 'strike', decoration: 'lineThrough', style: [ 'html-strike' ] }
test("strike",function(t) {
  var ret = htmlToPdfMake("<strike>strike</strike>", window);
  t.check(Array.isArray(ret) && ret.length===1, "return is OK");
  ret = ret[0];
  t.check(
    ret.text === "strike" &&
    ret.decoration === "lineThrough" &&
    Array.isArray(ret.style) &&
    ret.style[0] === 'html-strike',
  "<strike>");

  t.finish();
})

// [{"table":{"body":[[{"text":"Header Column A","bold":true,"fillColor":"#EEEEEE","style":["html-th"]},{"text":"Header Column B","bold":true,"fillColor":"#EEEEEE","style":["html-th"]}],[{"text":"Value Cell A2","style":["html-td"]},{"text":"Value Cell B2","style":["html-td"]}],[{"text":"Value Cell A3","style":["html-td"]},{"text":"Value Cell B3","style":["html-td"]}]]},"style":"html-table","marginBottom":5}]
test("table",function(t) {
  var html = `<table>
    <thead>
      <tr>
        <th>Header Column A</th>
        <th>Header Column B</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Value Cell A2</td>
        <td>Value Cell B2</td>
      </tr>
      <tr>
        <td>Value Cell A3</td>
        <td>Value Cell B3</td>
      </tr>
    </tbody>
  </table>`;
  var ret = htmlToPdfMake(html, window);
  t.check(Array.isArray(ret) && ret.length===1, "return is OK");
  ret = ret[0];
  t.check(
    ret.table &&
    Array.isArray(ret.table.body) &&
    ret.table.body.length === 3 &&
    ret.table.body[0][0].text === "Header Column A" &&
    ret.table.body[0][0].style[0] === 'html-th' &&
    ret.table.body[1][1].text === "Value Cell B2" &&
    ret.table.body[1][1].style[0] === 'html-td' &&
    Array.isArray(ret.style) &&
    ret.style[0] === 'html-table',
  "<table>");

  t.finish();
})

test("img",function(t) {
  var ret = htmlToPdfMake('<img width="10" style="height:10px" src="data:image/jpeg;base64,...encodedContent...">', window);
  t.check(Array.isArray(ret) && ret.length===1, "return is OK");
  ret = ret[0];
  t.check(
    ret.image === "data:image/jpeg;base64,...encodedContent..." &&
    ret.width === 10 && ret.height === 10 &&
    Array.isArray(ret.style) &&
    ret.style[0] === 'html-img',
  "<img>");

  t.finish();
})
