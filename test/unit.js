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
    ret.table.body[0][0].style[1] === 'html-tr' &&
    ret.table.body[1][1].text === "Value Cell B2" &&
    ret.table.body[1][1].style[0] === 'html-td' &&
    ret.table.body[1][1].style[1] === 'html-tr' &&
    Array.isArray(ret.style) &&
    ret.style[0] === 'html-table',
  "<table>");

  t.finish();
})

// { table:  { body: [ [ { text: 'Cell1', style: [ 'html-td', 'html-tr' ] } ] ] },  style: [ 'html-table' ],  marginBottom: 5 }
test("table (one row/one column)",function(t) {
  var html = `<table>
      <tr>
        <td>Cell1</td>
      </tr>
  </table>`;
  var ret = htmlToPdfMake(html, window);
  t.check(Array.isArray(ret) && ret.length===1, "return is OK");
  ret = ret[0];
  t.check(
    ret.table &&
    Array.isArray(ret.table.body) &&
    ret.table.body.length === 1 &&
    ret.table.body[0][0].text === "Cell1" &&
    ret.table.body[0][0].style[0] === 'html-td' &&
    ret.table.body[0][0].style[1] === 'html-tr' &&
    Array.isArray(ret.style) &&
    ret.style[0] === 'html-table',
  "table (one row/one column)");

  t.finish();
})

test("table (one row/two columns)",function(t) {
  var html = `<table>
      <tr>
        <td>Cell1</td><td>Cell2</td>
      </tr>
  </table>`;
  var ret = htmlToPdfMake(html, window);
  t.check(Array.isArray(ret) && ret.length===1, "return is OK");
  ret = ret[0];
  t.check(
    ret.table &&
    Array.isArray(ret.table.body) &&
    ret.table.body.length === 1 &&
    ret.table.body[0][0].text === "Cell1" &&
    ret.table.body[0][0].style[0] === 'html-td' &&
    ret.table.body[0][0].style[1] === 'html-tr' &&
    ret.table.body[0][1].text === "Cell2" &&
    ret.table.body[0][1].style[0] === 'html-td' &&
    ret.table.body[0][1].style[1] === 'html-tr' &&
    Array.isArray(ret.style) &&
    ret.style[0] === 'html-table',
  "table (one row/two columns)");

  t.finish();
})

test("table (two rows/one column)",function(t) {
  var html = `<table>
      <tr>
        <td>Cell1</td>
      </tr>
      <tr>
        <td>Cell2</td>
      </tr>
  </table>`;
  var ret = htmlToPdfMake(html, window);
  t.check(Array.isArray(ret) && ret.length===1, "return is OK");
  ret = ret[0];
  t.check(
    ret.table &&
    Array.isArray(ret.table.body) &&
    ret.table.body.length === 2 &&
    ret.table.body[0][0].text === "Cell1" &&
    ret.table.body[0][0].style[0] === 'html-td' &&
    ret.table.body[0][0].style[1] === 'html-tr' &&
    ret.table.body[1][0].text === "Cell2" &&
    ret.table.body[1][0].style[0] === 'html-td' &&
    ret.table.body[1][0].style[1] === 'html-tr' &&
    Array.isArray(ret.style) &&
    ret.style[0] === 'html-table',
  "table (two rows/one column)");

  t.finish();
})

test("table (rowspan/colspan)", function(t) {
  var html = `<table>
    <tr>
      <th>Col A</th>
      <th>Col B</th>
      <th>Col C</th>
      <th>Col D</th>
    </tr>
    <tr>
      <td>Cell A1</td>
      <td rowspan="2">
        Cell B1 & B2
      </td>
      <td>Cell C1</td>
      <td rowspan="2">
        Cell D1 & D2
      </td>
    </tr>
    <tr>
      <td>Cell A2</td>
      <td>Cell C2</td>
    </tr>
    <tr>
      <td>Cell A3</td>
      <td colspan="2">Cell B3 & C3</td>
      <td>Cell D3</td>
    </tr>
    <tr>
      <td rowspan="2" colspan="3">
        Cell A4 & A5 & B4 & B5 & C4 & C5
      </td>
      <td>Cell D4</td>
    </tr>
    <tr>
      <td>Cell D5</td>
    </tr>
  </table>`;
  var ret = htmlToPdfMake(html, window);
  t.check(Array.isArray(ret) && ret.length===1, "return is OK");
  ret = ret[0];

  t.check(
    ret.table &&
    Array.isArray(ret.table.body) &&
    ret.table.body.length === 6, "base");
  t.check(
    ret.table.body[1][0].text === "Cell A1" &&
    ret.table.body[1][0].style[0] === 'html-td' &&
    ret.table.body[1][0].style[1] === 'html-tr', "row 1");
  t.check(
    ret.table.body[1][1].text === "Cell B1 & B2" &&
    ret.table.body[1][2].text === "Cell C1" &&
    ret.table.body[1][3].text === "Cell D1 & D2", "row 2");
  t.check(
    ret.table.body[2][0].text === "Cell A2" &&
    ret.table.body[2][1].text === "" &&
    ret.table.body[2][2].text === "Cell C2" &&
    ret.table.body[2][3].text === "", "row 3");
  t.check(
    ret.table.body[3][0].text === "Cell A3" &&
    ret.table.body[3][1].text === "Cell B3 & C3" &&
    ret.table.body[3][2] === "" &&
    ret.table.body[3][3].text === "Cell D3", "row 4");
  t.check(
    ret.table.body[4][0].text === "Cell A4 & A5 & B4 & B5 & C4 & C5" &&
    ret.table.body[4][1] === "" &&
    ret.table.body[4][2] === "" &&
    ret.table.body[4][3].text === "Cell D4", "row 5");
  t.check(
    ret.table.body[5][0].text === "" &&
    ret.table.body[5][1] === "" &&
    ret.table.body[5][2] === "" &&
    ret.table.body[5][3].text === "Cell D5", "row 6");
  t.check(
    Array.isArray(ret.style) &&
    ret.style[0] === 'html-table', "table style");

  t.finish();
})

test("table (colspan + empty cell)", function(t) {
  var html = `<table>
    <thead>
      <tr>
        <th colspan="2">header</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Cell A1</td>
        <td>Cell A2</td>
      </tr>
      <tr>
        <td>Cell B1</td>
        <td></td>
      </tr>
    </tbody>
  </table>`;
  var ret = htmlToPdfMake(html, window);
  t.check(Array.isArray(ret) && ret.length===1, "return is OK");
  ret = ret[0];

  t.check(
    ret.table &&
    Array.isArray(ret.table.body) &&
    ret.table.body.length === 3, "base");
  t.check(
    ret.table.body[0].length === 2 &&
    ret.table.body[0][0].text === "header" &&
    ret.table.body[0][0].style[0] === 'html-th' &&
    ret.table.body[0][0].style[1] === 'html-tr', "row 1");
  t.check(
    ret.table.body[1].length === 2 &&
    ret.table.body[1][0].text === "Cell A1" &&
    ret.table.body[1][1].text === "Cell A2", "row 2");
  t.check(
    ret.table.body[2].length === 2 &&
    ret.table.body[2][0].text === "Cell B1" &&
    ret.table.body[2][1].text === "", "row 3");
  t.check(
    Array.isArray(ret.style) &&
    ret.style[0] === 'html-table', "table style");

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

test("svg",function(t) {
  var ret = htmlToPdfMake(`
    <svg version="1.1" baseProfile="full" width="300" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="red" />
      <circle cx="150" cy="100" r="80" fill="green" />
      <text x="150" y="125" font-size="60" text-anchor="middle" fill="white">SVG</text>
    </svg>`, window);
  t.check(Array.isArray(ret) && ret.length===1, "return is OK");
  ret = ret[0];

  t.check(
    'svg' in ret && 
    ret.svg.length > 0, 
  "return has svg property")

  t.check(
    Array.isArray(ret.style) &&
    ret.style[0] === 'html-svg',
  "svg style");

  t.finish();
})

test("cascade_tags", function(t) {
  var ret = htmlToPdfMake('<p style="text-align: center;"><span style="font-size: 14px;"><em><strong>test</strong></em></span></p>', window);
  t.check(Array.isArray(ret) && ret.length===1, "return is OK");
  ret = ret[0];
  t.check(
    ret.text === "test" &&
    ret.bold &&
    ret.italics &&
    ret.fontSize === 14 &&
    ret.alignment === 'center' &&
    Array.isArray(ret.style) &&
    ret.style.includes('html-strong') &&
    ret.style.includes('html-em') &&
    ret.style.includes('html-span') &&
    ret.style.includes('html-p'),
  "cascade_tags");

  t.finish();
})

test("hr", function(t) {
  var ret = htmlToPdfMake("<hr>", window);
  t.check(Array.isArray(ret) && ret.length === 1, "return is OK");
  ret = ret[0];

  t.check(
    !!ret.canvas && ret.canvas.length === 1 && ret.canvas[0].type === "line",
    "hr tag"
  );

  t.finish();
})
