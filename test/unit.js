var htmlToPdfMake = require('../index.js');
var test = require("simple-test-framework");
var jsdom = require("jsdom");
var { JSDOM } = jsdom;
var { window } = new JSDOM("");
var debug = false;

test("unit tests", function(t) {
  t.test("b",function(t) {
    var ret = htmlToPdfMake("<b>bold word</b>", {window:window});
    if (debug) console.log(JSON.stringify(ret));
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

  t.test("strong",function(t) {
    var ret = htmlToPdfMake("<strong>bold word</strong>", {window:window});
    if (debug) console.log(JSON.stringify(ret));
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

  t.test("u",function(t) {
    var ret = htmlToPdfMake("<u>underline word</u>", {window:window});
    if (debug) console.log(JSON.stringify(ret));
    t.check(Array.isArray(ret) && ret.length===1, "return is OK");
    ret = ret[0];
    t.check(
      ret.text === "underline word" &&
      Array.isArray(ret.decoration) && ret.decoration.length === 1 && ret.decoration[0] &&
      Array.isArray(ret.style) &&
      ret.style[0] === 'html-u',
    "<u>");

    t.finish();
  })

  t.test("em",function(t) {
    var ret = htmlToPdfMake("<em>italic word</em>", {window:window});
    if (debug) console.log(JSON.stringify(ret));
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

  t.test("i",function(t) {
    var ret = htmlToPdfMake("<i>italic word</i>", {window:window});
    if (debug) console.log(JSON.stringify(ret));
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

  t.test("h1",function(t) {
    var ret = htmlToPdfMake("<h1>level 1</h1>", {window:window});
    if (debug) console.log(JSON.stringify(ret));
    t.check(Array.isArray(ret), "return is OK");
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

  t.test("h2",function(t) {
    var ret = htmlToPdfMake("<h2>level 2</h2>", {window:window});
    if (debug) console.log(JSON.stringify(ret));
    t.check(Array.isArray(ret), "return is OK");
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

  t.test("h3",function(t) {
    var ret = htmlToPdfMake("<h3>level 3</h3>", {window:window});
    if (debug) console.log(JSON.stringify(ret));
    t.check(Array.isArray(ret), "return is OK");
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

  t.test("h4",function(t) {
    var ret = htmlToPdfMake("<h4>level 4</h4>", {window:window});
    if (debug) console.log(JSON.stringify(ret));
    t.check(Array.isArray(ret), "return is OK");
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

  t.test("h5",function(t) {
    var ret = htmlToPdfMake("<h5>level 5</h5>", {window:window});
    if (debug) console.log(JSON.stringify(ret));
    t.check(Array.isArray(ret), "return is OK");
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

  t.test("h6",function(t) {
    var ret = htmlToPdfMake("<h6>level 6</h6>", {window:window});
    if (debug) console.log(JSON.stringify(ret));
    t.check(Array.isArray(ret), "return is OK");
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

  t.test("a",function(t) {
    var ret = htmlToPdfMake('<a href="https://www.somewhere.com">link</a>', {window:window});
    if (debug) console.log(JSON.stringify(ret));
    t.check(Array.isArray(ret) && ret.length===1, "return is OK");
    ret = ret[0];
    t.check(ret.text === "link", "text");
    t.check(ret.color === "blue", "color");
    t.check(Array.isArray(ret.decoration) && ret.decoration.length === 1 && ret.decoration[0] === "underline", "decoration");
    t.check(ret.link === "https://www.somewhere.com", "href");
    t.check(Array.isArray(ret.style), "style is array");
    t.check(ret.style[0] === 'html-a', "class");

    t.finish();
  })

  t.test("a with image",function(t) {
    var ret = htmlToPdfMake('<a href="https://picsum.photos/seed/picsum/200"><img src="https://picsum.photos/seed/picsum/200"></a>', {window:window});
    if (debug) console.log(JSON.stringify(ret));
    t.check(Array.isArray(ret) && ret.length===1 && Array.isArray(ret[0].stack) && ret[0].stack.length===1, "return is OK");
    ret = ret[0].stack[0];
    t.check(ret.image === "https://picsum.photos/seed/picsum/200", "src");
    t.check(ret.link === "https://picsum.photos/seed/picsum/200", "link");

    t.finish();
  })

  t.test("strike",function(t) {
    var ret = htmlToPdfMake("<strike>strike</strike>", {window:window});
    if (debug) console.log(JSON.stringify(ret));
    t.check(Array.isArray(ret) && ret.length===1, "return is OK");
    ret = ret[0];
    t.check(
      ret.text === "strike" &&
      Array.isArray(ret.decoration) && ret.decoration.length === 1 && ret.decoration[0] === "lineThrough" &&
      Array.isArray(ret.style) &&
      ret.style[0] === 'html-strike',
    "<strike>");

    t.finish();
  })

  // [{"table":{"body":[[{"text":"Header Column A","bold":true,"fillColor":"#EEEEEE","style":["html-th"]},{"text":"Header Column B","bold":true,"fillColor":"#EEEEEE","style":["html-th"]}],[{"text":"Value Cell A2","style":["html-td"]},{"text":"Value Cell B2","style":["html-td"]}],[{"text":"Value Cell A3","style":["html-td"]},{"text":"Value Cell B3","style":["html-td"]}]]},"style":"html-table","marginBottom":5}]
  t.test("table",function(t) {
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
    var ret = htmlToPdfMake(html, {window:window});
    if (debug) console.log(JSON.stringify(ret));
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
  t.test("table (one row/one column)",function(t) {
    var html = `<table>
        <tr>
          <td>Cell1</td>
        </tr>
    </table>`;
    var ret = htmlToPdfMake(html, {window:window});
    if (debug) console.log(JSON.stringify(ret));
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

  t.test("table (one row/two columns)",function(t) {
    var html = `<table>
        <tr>
          <td>Cell1</td><td>Cell2</td>
        </tr>
    </table>`;
    var ret = htmlToPdfMake(html, {window:window});
    if (debug) console.log(JSON.stringify(ret));
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

  t.test("table (two rows/one column)",function(t) {
    var html = `<table>
        <tr>
          <td>Cell1</td>
        </tr>
        <tr>
          <td>Cell2</td>
        </tr>
    </table>`;
    var ret = htmlToPdfMake(html, {window:window});
    if (debug) console.log(JSON.stringify(ret));
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

  t.test("table (rowspan/colspan)", function(t) {
    var html = `<table>
      <tr>
        <th>Col A</th>
        <th>Col B</th>
        <th>Col C</th>
        <th>Col D</th>
      </tr>
      <tr>
        <td>Cell A1</td>
        <td rowspan="2">Cell B1 & B2</td>
        <td>Cell C1</td>
        <td rowspan="2">Cell D1 & D2</td>
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
        <td rowspan="2" colspan="3">Cell A4 & A5 & B4 & B5 & C4 & C5</td>
        <td>Cell D4</td>
      </tr>
      <tr>
        <td>Cell D5</td>
      </tr>
    </table>`;
    var ret = htmlToPdfMake(html, {window:window});
    if (debug) console.log(JSON.stringify(ret));
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
      ret.table.body[3][2].text === "" &&
      ret.table.body[3][3].text === "Cell D3", "row 4");
    t.check(
      ret.table.body[4][0].text === "Cell A4 & A5 & B4 & B5 & C4 & C5" &&
      ret.table.body[4][1].text === "" &&
      ret.table.body[4][2].text === "" &&
      ret.table.body[4][3].text === "Cell D4", "row 5");
    t.check(
      ret.table.body[5][0].text === "" &&
      ret.table.body[5][1].text === "" &&
      ret.table.body[5][2].text === "" &&
      ret.table.body[5][3].text === "Cell D5", "row 6");
    t.check(
      Array.isArray(ret.style) &&
      ret.style[0] === 'html-table', "table style");

    t.finish();
  })

  t.test("table (rowspan/colspan) with thead tbody", function(t) {
    var html = `<table>
      <thead>
          <tr>
            <th>Col A</th>
            <th>Col B</th>
            <th>Col C</th>
            <th>Col D</th>
          </tr>
      </thead>
      <tbody>
          <tr>
            <td>Cell A1</td>
            <td rowspan="2">Cell B1 & B2</td>
            <td>Cell C1</td>
            <td rowspan="2">Cell D1 & D2</td>
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
            <td rowspan="2" colspan="3">Cell A4 & A5 & B4 & B5 & C4 & C5</td>
            <td>Cell D4</td>
          </tr>
          <tr>
            <td>Cell D5</td>
          </tr>
      </tbody>
    </table>`;
    var ret = htmlToPdfMake(html, {window:window});
    if (debug) console.log(JSON.stringify(ret));
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
      ret.table.body[3][2].text === "" &&
      ret.table.body[3][3].text === "Cell D3", "row 4");
    t.check(
      ret.table.body[4][0].text === "Cell A4 & A5 & B4 & B5 & C4 & C5" &&
      ret.table.body[4][1].text === "" &&
      ret.table.body[4][2].text === "" &&
      ret.table.body[4][3].text === "Cell D4", "row 5");
    t.check(
      ret.table.body[5][0].text === "" &&
      ret.table.body[5][1].text === "" &&
      ret.table.body[5][2].text === "" &&
      ret.table.body[5][3].text === "Cell D5", "row 6");
    t.check(
      Array.isArray(ret.style) &&
      ret.style[0] === 'html-table', "table style");

    t.finish();
  })

  t.test("table (colspan + empty cell)", function(t) {
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
    var ret = htmlToPdfMake(html, {window:window});
    if (debug) console.log(JSON.stringify(ret));
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

  t.test("img",function(t) {
    var ret = htmlToPdfMake('<img width="10" style="height:10px" src="data:image/jpeg;base64,...encodedContent...">', {window:window});
    if (debug) console.log(JSON.stringify(ret));
    t.check(Array.isArray(ret) && ret.length===1, "return is OK");
    ret = ret[0];
    t.check(
      ret.image === "data:image/jpeg;base64,...encodedContent..." &&
      ret.width === 8 && ret.height === 8 &&
      Array.isArray(ret.style) &&
      ret.style[0] === 'html-img',
    "<img>");

    t.finish();
  })

  t.test("svg",function(t) {
    var ret = htmlToPdfMake(`
      <svg version="1.1" baseProfile="full" width="300" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="red" />
        <circle cx="150" cy="100" r="80" fill="green" />
        <text x="150" y="125" font-size="60" text-anchor="middle" fill="white">SVG</text>
      </svg>`, {window:window});
    if (debug) console.log(JSON.stringify(ret));
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

  t.test("cascade_tags", function(t) {
    var ret = htmlToPdfMake('<p style="text-align: center;"><span style="font-size: 14px;"><em><strong>test</strong></em></span></p>', {window:window});
    if (debug) console.log(JSON.stringify(ret));
    t.check(Array.isArray(ret) && ret.length===1, "return is OK");
    ret = ret[0].text[0].text[0].text[0];
    t.check(
      ret.text === "test" &&
      ret.bold &&
      ret.italics &&
      ret.fontSize === 11 &&
      ret.alignment === 'center' &&
      Array.isArray(ret.style) &&
      ret.style.includes('html-strong') &&
      ret.style.includes('html-em') &&
      ret.style.includes('html-span') &&
      ret.style.includes('html-p'),
    "cascade_tags");

    t.finish();
  })

  t.test("hr", function(t) {
    var ret = htmlToPdfMake("<hr>", {window:window});
    if (debug) console.log(JSON.stringify(ret));
    t.check(Array.isArray(ret) && ret.length === 1, "return is OK");
    ret = ret[0];

    t.check(
      !!ret.canvas && ret.canvas.length === 1 && ret.canvas[0].type === "line",
      "hr tag"
    );

    t.finish();
  })

  t.test("table non empty inside div styles",function(t) {
    var html = `<table>
      <thead>
        <tr>
          <th><div> </div></th>
          <th><div>Header Column B</div></th>
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
    var ret = htmlToPdfMake(html, {window:window});
    if (debug) console.log(JSON.stringify(ret));
    t.check(Array.isArray(ret) && ret.length===1, "return is OK");
    ret = ret[0];
    t.check(
      ret.table &&
      Array.isArray(ret.table.body) &&
      ret.table.body[0].length === ret.table.body[1].length,
      "global");

    t.finish();
  })

  t.test("table empty inside div header",function(t) {
    var html = `<table>
      <thead>
        <tr>
          <th><div></div></th>
          <th><div>Header Column B</div></th>
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
    var ret = htmlToPdfMake(html, {window:window});
    if (debug) console.log(JSON.stringify(ret));
    t.check(Array.isArray(ret) && ret.length===1, "return is OK");
    ret = ret[0];
    t.check(
      ret.table &&
      Array.isArray(ret.table.body) &&
      ret.table.body[0].length === ret.table.body[1].length,
      "global");

    t.finish();
  })

  t.test("inherit css styles",function(t) {
    var html = `<div style="color:red;"><span style="color:blue">blue<strong style="color:green">green</strong>blue</span><span>red</span></div>`;
    var ret = htmlToPdfMake(html, {window:window});
    if (debug) console.log(JSON.stringify(ret));
    t.check(Array.isArray(ret) && ret.length===1, "return is OK");
    ret = ret[0];
    t.check(
      ret.color === 'red' &&
      Array.isArray(ret.style) &&
      ret.style.includes('html-div') &&
      Array.isArray(ret.text) &&
      Array.isArray(ret.text[0].text) &&
      ret.text[0].text[0].text === 'blue' &&
      ret.text[0].text[0].color === 'blue' &&
      ret.text[0].text[1].text === 'green' &&
      ret.text[0].text[1].color === 'green' &&
      ret.text[0].text[1].bold &&
      ret.text[0].text[2].text === 'blue' &&
      ret.text[0].text[2].color === 'blue' &&
      ret.text[0].color === 'blue' &&
      ret.text[1].text === 'red' &&
      ret.text[1].color === 'red',
    "inherit");

    t.finish();
  })

  t.test("colored borders", function(t) {
    var html = `<table><tr><td style="border-top-width: 0; border-right: 1pt solid #0080C0; border-bottom: 0; border-left: 1px solid #0080C0;">Cell with border left and right in blue</td></tr></table>`;
    var ret = htmlToPdfMake(html, {window:window});
    if (debug) console.log(JSON.stringify(ret));
    t.check(Array.isArray(ret) && ret.length===1, "return is OK");
    ret = ret[0];
    t.check(
      ret.table.body[0][0].text === "Cell with border left and right in blue" &&
      Array.isArray(ret.table.body[0][0].border) &&
      ret.table.body[0][0].border[0] &&
      !ret.table.body[0][0].border[1] &&
      ret.table.body[0][0].border[2] &&
      !ret.table.body[0][0].border[3] &&
      Array.isArray(ret.table.body[0][0].borderColor) &&
      ret.table.body[0][0].borderColor[0] === '#0080c0' &&
      ret.table.body[0][0].borderColor[1] === '#000000' &&
      ret.table.body[0][0].borderColor[2] === '#0080c0' &&
      ret.table.body[0][0].borderColor[3] === '#000000',
    "colored borders");

    t.finish();
  })

  t.test("cell with P and DIV", function(t) {
    var html = `<table><tr><td>some text<p>p1<span>span1</span><span>span2</span></p><p>p2</p><span>span3</span><p><span>p3span4</span></p><div><span>span5</span><p>p4</p></div><strong>strong</strong></td></tr></table>`;
    var ret = htmlToPdfMake(html, {window:window});
    if (debug) console.log(JSON.stringify(ret));
    t.check(Array.isArray(ret) && ret.length===1, "return is OK");
    ret = ret[0].table.body[0][0];
    t.check(ret.stack[0].text === "some text", "some text");
    t.check(ret.stack[1].text[0].text === "p1", "p1");
    t.check(ret.stack[1].text[1].text === "span1", "span1");
    t.check(ret.stack[1].text[2].text === "span2", "span2");
    t.check(ret.stack[2].text === "p2", "p2");
    t.check(ret.stack[3].text === "span3", "span3");
    t.check(ret.stack[4].text[0].text === "p3span4", "p3span4");
    t.check(ret.stack[5].stack[0].text === "span5", "span5");
    t.check(ret.stack[5].stack[1].text === "p4", "p4");
    t.check(ret.stack[6].text === "strong", "strong");

    t.finish();
  })

  t.test("tableAutoSize", function(t) {
    var html = `<table><tr style="height:100px"><td style="width:350px"></td><td></td></tr><tr><td style="width:100px"></td><td style="height:200px"></td></tr></table>`;
    var ret = htmlToPdfMake(html, {window:window, tableAutoSize:true});
    if (debug) console.log(JSON.stringify(ret));
    t.check(Array.isArray(ret) && ret.length===1, "return is OK");
    ret = ret[0];
    t.check(
      Array.isArray(ret.table.widths) &&
      ret.table.widths.length === 2 &&
      ret.table.widths[0] === 264 &&
      ret.table.widths[1] === 'auto' &&
      ret.table.heights.length === 2 &&
      ret.table.heights[0] === 75 &&
      ret.table.heights[1] === 151
    , "tableAutoSize");

    t.finish();
  })

  t.test("convertUnit and stack", function(t) {
    var html = `<div><div style="font-size:16px;margin-left:12pt">points</div><div style="margin-left:1rem">points</div></div>`;
    var ret = htmlToPdfMake(html, {window:window});
    if (debug) console.log(JSON.stringify(ret));
    t.check(Array.isArray(ret) && ret.length===1, "return is OK");
    ret = ret[0];
    t.check(Array.isArray(ret.stack), "stack");
    t.check(
      ret.stack[0].marginLeft===12 &&
      ret.stack[0].fontSize===12 &&
      ret.stack[1].marginLeft===12
    , "convertUnit");
    t.finish();
  })

  t.test("'decoration' style", function(t) {
    var html = `<p><u><s>Test</s></u></p>`;
    var ret = htmlToPdfMake(html, {window:window});
    if (debug) console.log(JSON.stringify(ret));
    t.check(Array.isArray(ret) && ret.length===1, "return is OK");
    t.check(Array.isArray(ret[0].text) && ret[0].text.length===1 && Array.isArray(ret[0].text[0].text) && ret[0].text[0].text.length===1, "structure is OK");
    ret = ret[0].text[0].text[0];
    t.check(ret.text === "Test", "text is 'Test'");
    t.check(ret.nodeName === "S", "nodeName is 'S'");
    t.check(Array.isArray(ret.decoration), "'decoration' is array");
    t.check(ret.decoration.includes("underline"), "includes 'underline'");
    t.check(ret.decoration.includes("lineThrough"), "includes 'lineThrough'");
    t.finish();
  })

  t.test("'decoration' style 2", function(t) {
    var html = `<p><span style="text-decoration:underline"><span style="text-decoration:line-through">Test</span></span></p>`;
    var ret = htmlToPdfMake(html, {window:window});
    if (debug) console.log(JSON.stringify(ret));
    t.check(Array.isArray(ret) && ret.length===1, "return is OK");
    t.check(Array.isArray(ret[0].text) && ret[0].text.length===1 && Array.isArray(ret[0].text[0].text) && ret[0].text[0].text.length===1, "structure is OK");
    ret = ret[0].text[0].text[0];
    t.check(ret.text === "Test", "text is 'Test'");
    t.check(ret.nodeName === "SPAN", "nodeName is 'SPAN'");
    t.check(Array.isArray(ret.decoration), "'decoration' is array");
    t.check(ret.decoration.includes("underline"), "includes 'underline'");
    t.check(ret.decoration.includes("lineThrough"), "includes 'lineThrough'");
    t.finish();
  })

  t.test("font", function (t) {
    var html = `<font color="#ff0033" size="4">font element</font>`;
    var ret = htmlToPdfMake(html, {window: window});
    if (debug) console.log(JSON.stringify(ret));
    t.check(Array.isArray(ret) && ret.length === 1, "return is OK");
    ret = ret[0];
    t.check(ret.color === "#ff0033" && ret.fontSize === 18, "<font>");
    t.finish();
  });

  t.test("sup", function (t) {
    var html = `<sup>sup</sup>`;
    var ret = htmlToPdfMake(html, {window: window});
    if (debug) console.log(JSON.stringify(ret));
    t.check(Array.isArray(ret) && ret.length === 1, "return is OK");
    ret = ret[0];
    t.check(ret.text === "sup" && ret.sup && ret.sup.offset && ret.sup.fontSize, "<sup>");
    t.finish();
  });

  t.test("sub", function (t) {
    var html = `<sub>sub</sub>`;
    var ret = htmlToPdfMake(html, {window: window});
    if (debug) console.log(JSON.stringify(ret));
    t.check(Array.isArray(ret) && ret.length === 1, "return is OK");
    ret = ret[0];
    t.check(ret.text === "sub" && ret.sub && ret.sub.offset && ret.sub.fontSize, "<sub>");
    t.finish();
  });

  t.test("parse NAME color", function (t) {
    var html = `<span style="color:red">red</span>`;
    var ret = htmlToPdfMake(html, {window: window});
    if (debug) console.log(JSON.stringify(ret));
    t.check(Array.isArray(ret) && ret.length === 1, "return is OK");
    ret = ret[0];
    t.check(ret.text === "red" && ret.color === "red", "color:red");
    t.finish();
  });

  t.test("parse HEX color", function (t) {
    var html = `<span style="color:#E63737">red</span>`;
    var ret = htmlToPdfMake(html, {window: window});
    if (debug) console.log(JSON.stringify(ret));
    t.check(Array.isArray(ret) && ret.length === 1, "return is OK");
    ret = ret[0];
    t.check(ret.text === "red" && ret.color === "#e63737", "color:#E63737");
    t.finish();
  });

  t.test("parse RGB color", function (t) {
    var html = `<span style="color:rgb(230,55,55)">red</span>`;
    var ret = htmlToPdfMake(html, {window: window});
    if (debug) console.log(JSON.stringify(ret));
    t.check(Array.isArray(ret) && ret.length === 1, "return is OK");
    ret = ret[0];
    t.check(ret.text === "red" && ret.color === "#e63737", "color:rgb(230,55,55)");
    t.finish();
  });

  t.test("parse RGB color with %", function (t) {
    var html = `<span style="color:rgb(90.2%, 21.568%, 21.568%)">red</span>`;
    var ret = htmlToPdfMake(html, {window: window});
    if (debug) console.log(JSON.stringify(ret));
    t.check(Array.isArray(ret) && ret.length === 1, "return is OK");
    ret = ret[0];
    t.check(ret.text === "red" && ret.color === "#e63737", "color:rgb(90.2%, 21.568%, 21.568%)");
    t.finish();
  });

  t.test("parse HSL color", function (t) {
    var html = `<span style="color:hsl(0, 78%, 56%)">red</span>`;
    var ret = htmlToPdfMake(html, {window: window});
    if (debug) console.log(JSON.stringify(ret));
    t.check(Array.isArray(ret) && ret.length === 1, "return is OK");
    ret = ret[0];
    t.check(ret.text === "red" && ret.color === "#e73737", "color:hsl(0, 78%, 56%)");
    t.finish();
  });

  t.test("showHidden", function (t) {
    var html = `<div><div style="display:none">hidden</div><div>visible</div></div>`;
    var ret = htmlToPdfMake(html, {window: window, showHidden:true});
    if (debug) console.log(JSON.stringify(ret));
    t.check(Array.isArray(ret) && ret.length === 1, "return is OK");
    ret = ret[0];
    t.check(ret.stack.length === 2 && ret.stack[0].text === "hidden", "showHidden");
    t.finish();
  });

  t.test("ignoreStyles", function (t) {
    var html = `<div style="font-family:Roboto">Text in Roboto</div>`;
    var ret = htmlToPdfMake(html, {window: window, ignoreStyles:['font-family']});
    if (debug) console.log(JSON.stringify(ret));
    t.check(Array.isArray(ret) && ret.length === 1, "return is OK");
    ret = ret[0];
    t.check(ret.text === "Text in Roboto" && !ret.font, "ignoreStyles");
    t.finish();
  });

  t.test("borderValueRearrange", function (t) {
    var html = `<div style="border:solid 10px red">border</div>`;
    var ret = htmlToPdfMake(html, {window: window});
    if (debug) console.log(JSON.stringify(ret));
    t.check(Array.isArray(ret) && ret.length === 1, "return is OK");
    ret = ret[0];
    t.check(ret.text === "border" && Array.isArray(ret.border) && ret.border.filter(function(b) { return b===true }).length===4 && Array.isArray(ret.borderColor) && ret.borderColor.filter(function(b) { return b==='red' }).length===4, "borderValueRearrange");
    t.finish();
  });

  t.test("removeTagClasses", function (t) {
    var html = `<div class="my-div"><strong>hello world</strong></div>`;
    // [{"text":[{"text":"hello world","nodeName":"STRONG","bold":true,"style":["my-div"]}],"nodeName":"DIV","style":["my-div"]}]
    var ret = htmlToPdfMake(html, {window: window, removeTagClasses: true});
    if (debug) console.log(JSON.stringify(ret));
    t.check(Array.isArray(ret) && ret.length === 1, "return is OK");
    ret = ret[0];
    t.check(Array.isArray(ret.text) && ret.text[0].text==="hello world" && Array.isArray(ret.text[0].style) && ret.text[0].style.length===1 && ret.text[0].style[0]==="my-div" && Array.isArray(ret.style) && ret.style.length===1 && ret.style[0]==="my-div", "removeTagClasses");
    t.finish();
  });

  t.test("img with invalid width/height in style", function (t) {
    var html = `<img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/7QPQUGhvdG9zaG9wIDMuMAA4QklNA+kKUHJpbnQgSW5mbwAAAAB4AAMAAABIAEgAAAAAAtgCKP/h/+IC+QJGA0cFKAP8AAIAAABIAEgAAAAAAtgCKAABAAAAZAAAAAEAAwMDAAAAAScPAAEAAQA" style="width:100%;height:auto" />`;
    var ret = htmlToPdfMake(html, {window: window});
    // [{"nodeName":"IMG","image":"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/7QPQUGhvdG9zaG9wIDMuMAA4QklNA+kKUHJpbnQgSW5mbwAAAAB4AAMAAABIAEgAAAAAAtgCKP/h/+IC+QJGA0cFKAP8AAIAAABIAEgAAAAAAtgCKAABAAAAZAAAAAEAAwMDAAAAAScPAAEAAQA","width":false,"height":false,"style":["html-img"]}]
    if (debug) console.log(JSON.stringify(ret));
    t.check(Array.isArray(ret) && ret.length === 1, "return is OK");
    ret = ret[0];
    t.check(ret.image.startsWith("data:image") && ret.width===false && ret.height===false, "width/height to false");
    t.finish();
  });

  t.finish();
})
