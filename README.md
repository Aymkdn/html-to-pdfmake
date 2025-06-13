# html-to-pdfmake

Convert HTML to PDFMake format with ease. This library bridges the gap between HTML content and [PDFMake](https://pdfmake.github.io/docs/) document definitions, allowing you to generate PDFs from basic HTML while maintaining based styling and structure.

**Note**: if you need to convert a complex HTML, check some online solutions, like [Doppio](https://doppio.sh/), or you could try to convert [your HTML to canvas](https://github.com/chearon/dropflow) or [to an image](https://github.com/zumerlab/snapdom) and then to [export it to PDF](https://github.com/parallax/jsPDF).

## Features

- Convert HTML to PDFMake-compatible format
- Preserve basic styling and structure
- Support for tables, lists, images, and more
- Customizable styling options
- Works in both browser and Node.js environments
- Handle nested elements
- Custom tag support
- Image handling with reference support

## Online Demo

Try it live with the [online demo](https://aymkdn.github.io/html-to-pdfmake/index.html).

## Quick Start

### Browser Usage

```html
<!DOCTYPE html>
<html>
<head>
  <!-- Include required libraries -->
  <script src="https://cdn.jsdelivr.net/npm/pdfmake@latest/build/pdfmake.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/pdfmake@latest/build/vfs_fonts.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/html-to-pdfmake/browser.js"></script>
</head>
<body>
  <script>
    // Convert HTML to PDFMake format
    const html = `
      <div>
        <h1>Sample Document</h1>
        <p>This is a <strong>simple</strong> example with <em>formatted</em> text.</p>
      </div>
    `;
    
    const converted = htmlToPdfmake(html);
    const docDefinition = { content: converted };
    
    // Generate PDF
    pdfMake.createPdf(docDefinition).download('document.pdf');
  </script>
</body>
</html>
```

### Node.js Usage

```bash
npm install html-to-pdfmake jsdom
```

```javascript
const pdfMake = require('pdfmake/build/pdfmake');
const pdfFonts = require('pdfmake/build/vfs_fonts');
const htmlToPdfmake = require('html-to-pdfmake');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

// the below line may vary depending on your version of PDFMake
// please, check https://github.com/bpampuch/pdfmake to know how to initialize this library
pdfMake.vfs = pdfFonts;

// initiate the "window" object in Node
const { window } = new JSDOM('');

// Convert HTML to PDFMake format
const html = `
  <div>
    <h1>Sample Document</h1>
    <p>This is a <strong>simple</strong> example with <em>formatted</em> text.</p>
  </div>
`;

const converted = htmlToPdfmake(html, { window });
const docDefinition = { content: converted };

// Generate PDF
pdfMake.createPdf(docDefinition).getBuffer((buffer) => {
  require('fs').writeFileSync('output.pdf', buffer);
});
```

## Supported HTML Elements

### Block Elements
- `<div>`, `<p>`, `<h1>` to `<h6>`
- `<table>`, `<thead>`, `<tbody>`, `<tfoot>`, `<tr>`, `<th>`, `<td>`
- `<ul>`, `<ol>`, `<li>`
- `<pre>`

### Inline Elements
- `<span>`, `<strong>`, `<b>`, `<em>`, `<i>`, `<s>`
- `<a>` (with support for external and internal links)
- `<sub>`, `<sup>`
- `<img>`, `<svg>`
- `<br>`, `<hr>`

### CSS Properties Support

The library handles these CSS properties:

| Property | Support Details |
|----------|----------------|
| `background-color` | Good support |
| `border` | Including individual borders |
| `color` | Good support, including opacity |
| `font-family` | Basic support |
| `font-style` | Support for `italic` |
| `font-weight` | Support for `bold` |
| `height` | For tables and images |
| `width` | For tables and images |
| `margin` | Including individual margins |
| `text-align` | Good support |
| `text-decoration` | Support for `underline`, `line-through` |
| `text-indent` | Basic support |
| `white-space` | Support for `nowrap`, `pre`, `break-spaces` |
| `line-height` | Basic support |
| `list-style-type` | Good support |

## Configuration Options

The `htmlToPdfmake` function accepts an options object as its second parameter:

```javascript
const options = {
  defaultStyles: {
    // Override default element styles that are defined below
    b: {bold:true},
    strong: {bold:true},
    u: {decoration:'underline'},
    del: {decoration:'lineThrough'},
    s: {decoration: 'lineThrough'},
    em: {italics:true},
    i: {italics:true},
    h1: {fontSize:24, bold:true, marginBottom:5},
    h2: {fontSize:22, bold:true, marginBottom:5},
    h3: {fontSize:20, bold:true, marginBottom:5},
    h4: {fontSize:18, bold:true, marginBottom:5},
    h5: {fontSize:16, bold:true, marginBottom:5},
    h6: {fontSize:14, bold:true, marginBottom:5},
    a: {color:'blue', decoration:'underline'},
    strike: {decoration: 'lineThrough'},
    p: {margin:[0, 5, 0, 10]},
    ul: {marginBottom:5,marginLeft:5},
    table: {marginBottom:5},
    th: {bold:true, fillColor:'#EEEEEE'}
  },
  tableAutoSize: false,  // Enable automatic table sizing
  imagesByReference: false,  // Handle images by reference
  removeExtraBlanks: false,  // Remove extra whitespace
  removeTagClasses: false,  // Keep HTML tag classes
  window: window,  // Required for Node.js usage
  ignoreStyles: [],  // Style properties to ignore
  fontSizes: [10, 14, 16, 18, 20, 24, 28], // Font sizes for legacy <font> tag
  customTag: function(params) { /* Custom tag handler */ }
};

const converted = htmlToPdfmake(html, options);
```

### Options Explained

#### defaultStyles

Object to override the default element styling. Useful for consistent document appearance:

```javascript
const options = {
  defaultStyles: {
    h1: { fontSize: 24, bold: true, marginBottom: 10 },
    p: { margin: [0, 5, 0, 10] },
    a: { color: 'purple', decoration: null }
  }
};
```

#### tableAutoSize

Boolean that enables automatic table sizing based on content and CSS properties

Example:
```html
const result = htmlToPdfmake(`<table>
  <tr style="height:100px">
    <td style="width:250px">height:100px / width:250px</td>
    <td>height:100px / width:'auto'</td>
  </tr>
  <tr>
    <td style="width:100px">Here it will use 250px for the width because we have to use the largest col's width</td>
    <td style="height:200px">height:200px / width:'auto'</td>
  </tr>
</table>`, { tableAutoSize:true });
```

#### imagesByReference

*For Web browser only, not for Node*

Boolean that enables the images handling by reference instead of embedding. It will automatically load your images in your PDF using the [`{images}` option of PDFMake](https://pdfmake.github.io/docs/document-definition-object/images/).

Using this option will change the output that will return an object with `{content, images}`.

```javascript
const html = `<img src="https://picsum.photos/seed/picsum/200">`;
const result = htmlToPdfmake(html, { imagesByReference:true });
// 'result' contains:
//  {
//    "content":[
//      [
//        {
//          "nodeName":"IMG",
//          "image":"img_ref_0",
//          "style":["html-img"]
//        }
//      ]
//    ],
//    "images":{
//      "img_ref_0":"https://picsum.photos/seed/picsum/200"
//    }
//  }

pdfMake.createPdf(result).download();
```

#### customTag

Function to handle custom HTML tags or modify existing tag behavior:

```javascript
const options = {
  customTag: function({ element, ret, parents }) {
    if (element.nodeName === 'CUSTOM-TAG') {
      // Handle custom tag
      ret.text = 'Custom content';
      ret.style = ['custom-style'];
    }
    return ret;
  }
};
```

Example with a QR code generator:

```javascript
const html = htmlToPdfMake(`<code typecode="QR" style="foreground:black;background:yellow;fit:300px">texto in code</code>`, {
  customTag:function(params) {
    let ret = params.ret;
    let element = params.element;
    let parents = params.parents;
    switch(ret.nodeName) {
      case "CODE": {
        ret = this.applyStyle({ret:ret, parents:parents.concat([element])});
        ret.qr = ret.text[0].text;
        switch(element.getAttribute("typecode")){
          case 'QR':
            delete ret.text;
            ret.nodeName='QR';
            if(!ret.style || !Array.isArray(ret.style)){
              ret.style = [];
            }
            ret.style.push('html-qr');
            break;
        }
        break;
      }
    }
    return ret;
  }
});
```

#### removeExtraBlanks

Boolean that will remove extra unwanted blank spaces from the PDF.

In [some cases](https://github.com/Aymkdn/html-to-pdfmake/issues/145) these blank spaces could appear. Using this option could be quite resource consuming.

#### showHidden

Boolean to display the hidden elements (`display:none`) in the PDF.

#### removeTagClasses

Boolean that permits to remove the `html-TAG` classes added for each node.

#### ignoreStyles

Array of string to define a list of style properties that should not be parsed.

For example, to ignore `font-family`:
```javascript
htmlToPdfmake("[the html code here]", { ignoreStyles:['font-family'] })
```

#### fontSizes

Array of 7 integers to overwrite the default sizes for the old HTML4 tag `<font>`.
  
#### replaceText

Function with two parameters (`text` and `nodes`) to modify the text of all the nodes in your HTML document.

Example:
```javascript
const result = htmlToPdfmake(`<p style='text-align: justify;'>Lorem Ipsum is simply d-ummy text of th-e printing and typese-tting industry. Lorem Ipsum has b-een the industry's standard dummy text ever since the 1500s</p>`, {
  replaceText:function(text, nodes) {
    // 'nodes' contains all the parent nodes for the text
    return text.replace(/-/g, "\\u2011"); // it will replace any occurrence of '-' with '\\u2011' in "Lorem Ipsum is simply d-ummy text […] dummy text ever since the 1500s"
  }
});
```

## Advanced Features

### Custom Styling with data-pdfmake

Apply PDFMake-specific properties using the `data-pdfmake` attribute:

```html
<!-- Custom table properties -->
<table data-pdfmake='{"widths": [100, "*", "auto"], "heights": 40}'>
  <tr>
    <td>Fixed Width</td>
    <td>Fill Space</td>
    <td>Auto Width</td>
  </tr>
</table>

<!-- Custom HR styling -->
<hr data-pdfmake='{"color": "red", "thickness": 2}'>
```

### Page Breaks

Control page breaks using CSS classes and PDFMake's [`pageBreakBefore`](https://pdfmake.github.io/docs/document-definition-object/page/):

```javascript
const html = `
  <div>
    <h1>First Page</h1>
    <h1 class="page-break">Second Page</h1>
  </div>
`;

const docDefinition = {
  content: htmlToPdfmake(html),
  pageBreakBefore: function(node) {
    return node.style && node.style.includes('page-break');
  }
};
```

### Image Handling

Support for various image formats and references:

```html
<!-- Best option: Base64 encoded image -->
<!-- Required for Node environment -->
<img src="data:image/jpeg;base64,/9j/4AAQ...">

<!-- Image by URL (with imagesByReference option) -->
<!-- Only works with Web Browser -->
<img src="https://example.com/image.jpg">

<!-- Image with custom headers -->
<img data-src='{"url": "https://example.com/image.jpg", "headers": {"Authorization": "Bearer token"}}'>
```

For Base64 encoded image, please refer to the [PDFMake documentation](https://pdfmake.github.io/docs/document-definition-object/images/) and [here](https://github.com/Aymkdn/html-to-pdfmake/issues/109#issue-932953144). And you can check [this Stackoverflow question](https://stackoverflow.com/questions/934012/get-image-data-in-javascript/42916772#42916772) to know the different ways to get a base64 encoded content from an image.

## Common Use Cases

### Tables with Complex Layouts

```html
<table>
  <thead>
    <tr>
      <th colspan="2">Header</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="2">Cell 1</td>
      <td>Cell 2</td>
    </tr>
    <tr>
      <td>Cell 3</td>
    </tr>
  </tbody>
</table>
```

### Styled Lists

```html
<ul style="margin-left: 20px">
  <li>First item</li>
  <li style="color: red">Second item</li>
  <li>
    Nested list:
    <ol style="list-style-type: lower-alpha">
      <li>Sub-item a</li>
      <li>Sub-item b</li>
    </ol>
  </li>
</ul>
```

### Links and Anchors

```html
<!-- External link -->
<a href="https://example.com">Visit Website</a>

<!-- Internal link -->
<a href="#section1">Jump to Section</a>
<h2 id="section1">Section 1</h2>
```

### Columns

PDFMake has a concept of [`columns`](https://pdfmake.github.io/docs/0.1/document-definition-object/columns/). We use `<div data-pdfmake-type="columns"></div>` to identify it.
  
Example to center a table in the page:
```html
<div data-pdfmake-type="columns">
  <div data-pdfmake='{"width":"*"}'></div>
  <div style="width:auto">
    <table><tr><th>Table</th><tr><tr><td>Centered</td></tr></table>
  </div>
  <div data-pdfmake='{"width":"*"}'></div>
</div>
```

## Examples

You can find more examples in [example.js](example.js) which will create [example.pdf](example.pdf):

```bash
npm install
node example.js
```

## Donate

You can support my work by [making a donation](https://www.paypal.me/aymkdn), or by visiting my [Github Sponsors page](https://github.com/sponsors/Aymkdn). Thank you!
