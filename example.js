var pdfMake = require("pdfmake/build/pdfmake");
var pdfFonts = require("pdfmake/build/vfs_fonts");
pdfMake.vfs = pdfFonts.pdfMake.vfs;
var fs = require("fs");
var jsdom = require("jsdom");
var { JSDOM } = jsdom;
var { window } = new JSDOM("");
var htmlToPdfMake = require("./index.js");
//var util = require("util");

var html = htmlToPdfMake(`
  Simple text
  <div>
    <h1>Title Level 1</h1>
    <h2 style="color:green;margin-bottom:10px">Title Level 2</h2>
    <h3>Title Level 3</h3>
    <h4>Title Level 4</h4>
    <h5>Title Level 5</h5>
    <h6>Title Level 6</h6>
  </div>
  <p>
    This is a sentence with a <strong>bold and purple word</strong>, <em>one in italic</em>, and <u>one with underline</u>. And finally <a href="https://somewhere">a link</a>.
  </p>
  <span style="color:orange;font-weight:bold;margin:10px 5px">An orange bold span with margins.</span>
  <p>
    Below is a unordered list:
    <ul>
      <li>First item</li>
      <li>Second item</li>
      <li>
        With a sub unordered list:
        <ul>
          <li>Sub First <b>bolded</b> item</li>
          <li>Sub Second <u>underlined</u> item</li>
          <li>With a sub sub unordered list:
            <ul style="background-color:yellow">
              <li>Sub Sub First item</li>
              <li>Sub Sub Second item</li>
            </ul>
          </li>
        </ul>
      </li>
      <li>
        With a sub order list:
        <ol>
          <li>Sub Item 1</li>
          <li>Sub Item 2</li>
          <li>With a sub sub ordered list
            <ol>
              <li>Sub Sub Item 1</li>
              <li>Sub Sub Item 2</li>
            </ol>
        </ol>
      </li>
    </ul>
    <br>This sentence is surrended by BR<br>
  </p>
  <p>
    A first level ordered list with type "I":
    <ol type="I">
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ol>
  </p>
  <div>
    <p class="bold">
      Text in bold.
      <span class="red">This is a red span</span>
    </p>
  </div>
  <span>&lt;HR&gt; with the default style:</span>
  <hr>
  <span class="pdf-pagebreak-before">Below, another &lt;HR&gt; but with different style: left=120, width=300, color='red', margin=[0,20,0,20], thickness=2</span>
  <hr data-pdfmake="{&quot;left&quot;:120, &quot;width&quot;:300, &quot;color&quot;:&quot;red&quot;, &quot;margin&quot;:[0,20,0,20], &quot;thickness&quot;:2}">
  <table>
    <thead>
      <tr>
        <th>Region</th>
        <th>Result Q1</th>
        <th>Result Q2</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th>Americas</th>
        <td>+3%</td>
        <td>+6%</td>
      </tr>
      <tr>
        <th>Europe</th>
        <td>+3.9%</td>
        <td>+5%</td>
      </tr>
      <tr>
        <th>Asia</th>
        <td>+1.5%</td>
        <td>+0.9%</td>
      </tr>
    </tbody>
  </table>

  <table>
    <tr>
      <th>Header Column 1</th>
      <th>Header Column 2</th>
    </tr>
    <tr>
      <td>Value Column 1</td>
      <td>Value Column 2</td>
    </tr>
  </table>

  <table>
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
  </table>

  <table data-pdfmake="{&quot;widths&quot;:[100,&quot;*&quot;,&quot;auto&quot;],&quot;heights&quot;:40}">
    <tr>
      <td colspan="3">Table with <b>widths=[100,"*","auto"]</b> and <b>heights=40</b> using "data-pdfmake" attribute</th>
    </tr>
    <tr>
      <td>Cell1</td>
      <td style="text-align:center">Cell2</td>
      <td style="text-align:right">Cell3</td>
    </tr>
  </table>

  <table>
    <tr>
      <td style="background-color:red">Cell with red background</td>
      <td>Cell</td>
      <td style="border:1px solid red">Cell with red borders</td>
    </tr>
  </table>

  <p>Table autosized based on style "height" and "width" using "tableAutoSize:true" option:</p>
  <table>
    <tr style="height:100px">
      <td style="width:250px">height:100px / width:250px</td>
      <td>height:100px / width:'auto'</td>
    </tr>
    <tr>
      <td style="width:100px">Here "&lt;td width="100"&gt;" will use 250px for the width because we have to use the largest col's width</td>
      <td style="height:200px">height:200px / width:'auto'</td>
    </tr>
  </table>

  <p>Change the table's layout (header with red border, body with blue border):</p>
  <table data-pdfmake="{&quot;layout&quot;:&quot;exampleLayout&quot;}">
    <tr>
      <th>Header A</th>
      <th>Header B</td>
    </tr>
    <tr>
      <td>A1</td>
      <td>B1</td>
    </tr>
    <tr>
      <td>A2</td>
      <td>B2</td>
    </tr>
    <tr>
      <td>A3</td>
      <td>B3</td>
    </tr>
  </table>

  <div style="display:none">display:none</div>

  <svg version="1.1" baseProfile="full" width="300" height="200" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="red" />
    <circle cx="150" cy="100" r="80" fill="green" />
  </svg>

  <div style="margin-top:20px">
    An image: <img width="54" style="height:70px" src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/7QPQUGhvdG9zaG9wIDMuMAA4QklNA+kKUHJpbnQgSW5mbwAAAAB4AAMAAABIAEgAAAAAAtgCKP/h/+IC+QJGA0cFKAP8AAIAAABIAEgAAAAAAtgCKAABAAAAZAAAAAEAAwMDAAAAAScPAAEAAQAAAAAAAAAAAAAAAGAIABkBkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOEJJTQPtClJlc29sdXRpb24AAAAAEAEsAAAAAQABASwAAAABAAE4QklNBA0YRlggR2xvYmFsIExpZ2h0aW5nIEFuZ2xlAAAAAAQAAAAeOEJJTQQZEkZYIEdsb2JhbCBBbHRpdHVkZQAAAAAEAAAAHjhCSU0D8wtQcmludCBGbGFncwAAAAkAAAAAAAAAAAEAOEJJTQQKDkNvcHlyaWdodCBGbGFnAAAAAAEAADhCSU0nEBRKYXBhbmVzZSBQcmludCBGbGFncwAAAAAKAAEAAAAAAAAAAjhCSU0D9RdDb2xvciBIYWxmdG9uZSBTZXR0aW5ncwAAAEgAL2ZmAAEAbGZmAAYAAAAAAAEAL2ZmAAEAoZmaAAYAAAAAAAEAMgAAAAEAWgAAAAYAAAAAAAEANQAAAAEALQAAAAYAAAAAAAE4QklNA/gXQ29sb3IgVHJhbnNmZXIgU2V0dGluZ3MAAABwAAD/////////////////////////////A+gAAAAA/////////////////////////////wPoAAAAAP////////////////////////////8D6AAAAAD/////////////////////////////A+gAADhCSU0ECAZHdWlkZXMAAAAAEAAAAAEAAAJAAAACQAAAAAA4QklNBB4NVVJMIG92ZXJyaWRlcwAAAAQAAAAAOEJJTQQaBlNsaWNlcwAAAABtAAAABgAAAAAAAAAAAAALiAAACMMAAAAGADYAMgAuADYAOAA0AAAAAQAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAjDAAALiAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4QklNBBQXTGF5ZXIgSUQgR2VuZXJhdG9yIEJhc2UAAAAEAAAAAThCSU0EIRpWZXJzaW9uIGNvbXBhdGliaWxp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">
  </div>

  <p style="text-align: center;"> <span style="font-size: 14px;"><em><strong>Bold italic centered text</strong></em></span> </p>

  <span class="a">text "bold" <span class="b">text "bold & italic" <span class="c">text "bold & italic & red"</span> text "bold & italic"</span> text "bold"</span>

  <div style="margin-top:20px">
    Below we preserve the spaces:
    <p class="with-spaces">     this    is     just     an     example.</p>
  </div>

  <div>And support for <font color="blue" size="3">FONT</font> tag.</div>
`, {window:window, tableAutoSize:true});

/*var html = htmlToPdfMake(``, {window:window});
console.log(JSON.stringify(html))*/

var docDefinition = {
  content: [
    html
  ],
  pageBreakBefore: function(currentNode) {
    // we add a page break before elements with the classname "pdf-pagebreak-before"
    return currentNode.style && currentNode.style.indexOf('pdf-pagebreak-before') > -1;
  },
  styles:{
    red:{
      color:'red'
    },
    blue:{
      color:'blue'
    },
    bold:{
      bold:true
    },
    'html-h6':{
      color:'purple'
    },
    'html-strong':{
      color:'purple'
    },
    'a':{
      bold:true
    },
    'b':{
      italics: true
    },
    'c':{
      color:'red',
      italics: false
    },
    'with-spaces':{
      preserveLeadingSpaces: true
    }
  }
};

var pdfDocGenerator = pdfMake.createPdf(docDefinition, {
  // see https://pdfmake.github.io/docs/0.1/document-definition-object/tables/
  exampleLayout: {
    hLineColor: function (rowIndex, node, colIndex) {
      if (rowIndex === node.table.body.length) return 'blue';
      return rowIndex <= 1 ? 'red' : '#dddddd';
    },
    vLineColor: function (colIndex, node, rowIndex) {
      if (rowIndex === 0) return 'red';
      return rowIndex > 0 && (colIndex === 0 || colIndex === node.table.body[0].length) ? 'blue' : 'black';
    }  
  }
});
pdfDocGenerator.getBuffer(function(buffer) {
  fs.writeFileSync('example.pdf', buffer);
  console.log('--> example.pdf')
});
