var pdfMake = require("pdfmake/build/pdfmake");
var pdfFonts = require("pdfmake/build/vfs_fonts");
pdfMake.vfs = pdfFonts.pdfMake.vfs;
var fs = require("fs");
var jsdom = require("jsdom");
var { JSDOM } = jsdom;
var { window } = new JSDOM("");
var htmlToPdfMake = require("./index.js");

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
    This is a sentence with a <strong>bold word</strong>, <em>one in italic</em>, and <u>one with underline</u>. And finally <a href="https://somewhere">a link</a>.
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
          <li>Sub First item</li>
          <li>Sub Second item</li>
          <li>With a sub sub unordered list:
            <ul>
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
    A first level ordered list:
    <ol>
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
`, window);

var docDefinition = {
  content: [
    html
  ],
  styles:{
    red:{
      color:'red'
    },
    bold:{
      bold:true
    },
    'html-p':{
      margin:[0, 5, 0, 5]
    }
  }
};

var pdfDocGenerator = pdfMake.createPdf(docDefinition);
pdfDocGenerator.getBuffer(function(buffer) {
  fs.writeFileSync('example.pdf', buffer);
  console.log('--> example.pdf')
});
