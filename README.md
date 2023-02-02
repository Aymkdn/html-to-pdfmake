# html-to-pdfmake

[pdfmake](https://pdfmake.github.io/docs/) permits to easily create a PDF with JavaScript; however there is no support of HTML code, so I decided to create a module to handle this feature.

## Online Demo

You can find the online demo at <a href="https://aymkdn.github.io/html-to-pdfmake/index.html">https://aymkdn.github.io/html-to-pdfmake/index.html</a>

## How to use

This module will convert some basic and valid HTML code to its equivalent in *pdfmake*.

### Node

```bash
npm install html-to-pdfmake
```

```javascript
var htmlToPdfmake = require("html-to-pdfmake");
// or:
// import htmlToPdfmake from "html-to-pdfmake"
```

Example:

```javascript
var pdfMake = require("pdfmake/build/pdfmake");
var pdfFonts = require("pdfmake/build/vfs_fonts");
pdfMake.vfs = pdfFonts.pdfMake.vfs;
var htmlToPdfmake = require("html-to-pdfmake");

var html = htmlToPdfmake(`
  <div>
    <h1>My title</h1>
    <p>
      This is a sentence with a <strong>bold word</strong>, <em>one in italic</em>,
      and <u>one with underline</u>. And finally <a href="https://www.somewhere.com">a link</a>.
    </p>
  </div>
`);

/*
it will return:
{
  stack:[
    {
      text: 'My title',
      fontSize: 24,
      bold: true,
      marginBottom: 5,
      style: ['html-h1']
    },
    {
      text: [
        {
          text: 'This is a sentence with a '
        },
        {
          text: 'bold word',
          bold: true,
          style: ['html-strong']
        },
        {
          text: ', '
        },
        {
          text: 'one in italic',
          italics: true,
          style: ['html-em']
        },
        {
          text: ', and '
        },
        {
          text: 'one with underline',
          decoration: 'underline',
          style: ['html-u']
        },
        {
          text: '. And finally '
        },
        {
          text: 'a link',
          color: 'blue',
          decoration: 'underline',
          link: 'https://www.somewhere.com',
          style: ['html-a']
        },
        {
          text: '.'
        }
      ],
      margin: [0, 5, 0, 10],
      style: ['html-p']
    }
  ],
  style: ['html-div']
}
 */
```

### Browser

```html
<script src="https://cdn.jsdelivr.net/npm/html-to-pdfmake/browser.js"></script>
```

Example:
```html
<!doctype html>
<html lang='en'>
<head>
  <meta charset='utf-8'>
  <title>my example</title>
  <!-- pdfmake files: -->
  <script src='https://cdn.jsdelivr.net/npm/pdfmake@latest/build/pdfmake.min.js'></script>
  <script src='https://cdn.jsdelivr.net/npm/pdfmake@latest/build/vfs_fonts.min.js'></script>
  <!-- html-to-pdfmake file: -->
  <script src="https://cdn.jsdelivr.net/npm/html-to-pdfmake/browser.js"></script>
</head>
<body>
  […]
  <script>
    var val = htmlToPdfmake("your html code here");
    var dd = {content:val};
    pdfMake.createPdf(dd).download();
  </script>
</body>
</html>
```

## Documentation

### Options

Some options can be passed to `htmlToPdfmake` function as a second argument.

#### `window`

If you use Node, then you'll have to pass the `window` object ([see below](https://github.com/Aymkdn/html-to-pdfmake#use-with-node)).

#### `defaultStyles`

You can overwrite the default styles using `defaultStyles` ([see below](https://github.com/Aymkdn/html-to-pdfmake#default-styles)).

#### `removeExtraBlanks`

In [some cases](https://github.com/Aymkdn/html-to-pdfmake/issues/145), you may see some extra blank spaces in the PDF. Because removing them could be quite resource consuming, the option is `false` by default.

#### `showHidden`

By default the `display:none` elements won't be parsed. Set this option to `true` to display the hidden elements in the PDF.

#### `removeTagClasses`

By default we add a class `html-TAG` for each node. It's possible to remove these CSS classes by using `removeTagClasses:true`.

#### `ignoreStyles`

You can define a list of style properties that should not be parsed. For example, to ignore `font-family`:
```javascript
htmlToPdfmake("[the html code here]", {ignoreStyles:['font-family']})
```

#### `imagesByReference`

If you're using `html-to-pdfmake` in a web browser with images, then you can set this option to `true` and it will automatically load your images in your PDF using the [`{images}` option of PDFMake](https://pdfmake.github.io/docs/document-definition-object/images/).

Using this option will change the output of `html-to-pdfmake` that will return an object with `{content, images}`.

Example:
```javascript
var ret = htmlToPdfmake(`<img src="https://picsum.photos/seed/picsum/200">`, {
  imagesByReference:true
});
// 'ret' contains:
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

var dd = {
  content:ret.content,
  images:ret.images
}
pdfMake.createPdf(dd).download();
```

You can use the "custom headers" too by passing a JSON string in either `src`, or `data-src`:
```html
<div>
  <img src="https://picsum.photos/id/1080/367/267" data-src="{&quot;url&quot;:&quot;https://picsum.photos/id/1080/367/267&quot;,&quot;headers&quot;:{&quot;myheader&quot;:&quot;123&quot;}}" />
  <img src="https://picsum.photos/seed/picsum/200/300" data-src='{"url":"https://picsum.photos/seed/picsum/200/300","headers":{"myheader":"123"}}' />
</div>
```

#### `fontSizes`

You can overwrite the default sizes for the old HTML4 tag `<font>` by using `fontSizes`. It must be an array with 7 values ([see below](https://github.com/Aymkdn/html-to-pdfmake#default-styles)).

#### `tableAutoSize`

By passing `tableAutoSize` with `true`, then the program will try to define `widths` and `heights` for the tables, based on CSS properties `width` and `height` that have been provided to `TH` or `TD`.

Example:
```javascript
var html = htmlToPdfmake(`<table>
  <tr style="height:100px">
    <td style="width:250px">height:100px / width:250px</td>
    <td>height:100px / width:'auto'</td>
  </tr>
  <tr>
    <td style="width:100px">Here it will use 250px for the width because we have to use the largest col's width</td>
    <td style="height:200px">height:200px / width:'auto'</td>
  </tr>
</table>`, {
  tableAutoSize:true
});

// it will return something like:
[ {
    "table": {
      "body": [ [ … ] ],
      "widths": [ 188, "auto" ],
      "heights": [ 75, 151 ]
    }
} ]
```

#### `replaceText`

By passing `replaceText` as a function with two parameters (`text` and `nodes`) you can modify the text of all the nodes in your HTML document.

Example:
```javascript
var html = htmlToPdfmake(`<p style='text-align: justify;'>Lorem Ipsum is simply d-ummy text of th-e printing and typese-tting industry. Lorem Ipsum has b-een the industry's standard dummy text ever since the 1500s</p>`, {
  replaceText:function(text, nodes) {
    // 'nodes' contains all the parent nodes for the text
    return text.replace(/-/g, "\\u2011"); // it will replace any occurrence of '-' with '\\u2011' in "Lorem Ipsum is simply d-ummy text […] dummy text ever since the 1500s"
  }
});
```

#### `customTag`

If your HTML code doesn't use regular HTML tags, then you can use `customTag` to define your own result.

Example with a QR code generator:
```js
var html = htmlToPdfMake(`<code typecode="QR" style="foreground:black;background:yellow;fit:300px">texto in code</code>`, {,
  customTag:function(params) {
    var ret = params.ret;
    var element = params.element;
    var parents = params.parents;
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

### HTML tags supported

The below HTML tags are supported:
  - `A` (with external and internal links)
  - `DIV` / `P` / `SPAN`
  - `B` / `STRONG`
  - `I` / `EM`
  - `S`
  - `UL` / `OL` / `LI`
  - `TABLE` / `THEAD` / `TBODY` / `TFOOTER` / `TR` / `TH` / `TD`
  - `H1` to `H6`
  - `FONT`
  - `IMG`
  - `SVG`
  - `SUP` / `SUB`
  
### CSS properties supported

CSS can create very complex design, however this framework can only handle the most simple HTML / CSS. The support of CSS style is limited and might not work in all cases with all values:
  - `background-color`
  - `border`
  - `color`
  - `font-family`
  - `font-style` (with `italic`)
  - `font-weight` (with `bold`)
  - `height`
  - `margin`
  - `text-align`
  - `text-decoration`
  - `text-indent`
  - `white-space` (with `break-spaces` and `pre*`)
  - `width`
  
### Default styles

I've defined some default styles for the supported element.

For example, using a &lt;STRONG&gt; will display the word in **bold**. Or, a link will appear in blue with an underline, and so on...

Here is the list of defaults styles:
```javascript
{
    b: {bold:true},
    strong: {bold:true},
    u: {decoration:'underline'},
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
    ul: {marginBottom:5},
    li: {marginLeft:5},
    table: {marginBottom:5},
    th: {bold:true, fillColor:'#EEEEEE'}
  }
```

For the old HTML4 tag `<font>`, the `size` attributes can have a value from 1 to 7, which will be converted to 10pt, 14pt, 16pt, 18pt, 20pt, 24pt, or 28pt.

**Please, note that the above default styles are stronger than the ones defined in the style classes.** Read below how to overwrite them.

### Customize style

Each converted element will have an associated style-class called `html-tagname`.

For example, if you want all &lt;STRONG&gt; tags to be highlighted with a yellow backgroud you can use `html-strong` in the `styles` definition:

```javascript
var html = htmlToPdfmake(`
  <p>
    This sentence has <strong>a highlighted word</strong>, but not only.
  </p>
  `);

var docDefinition = {
  content: [
    html
  ],
  styles:{
    'html-strong':{
      background:'yellow' // it will add a yellow background to all <STRONG> elements
    }
  }
};

var pdfDocGenerator = pdfMake.createPdf(docDefinition);
```

### CSS class and style

The `class` and `styles` for the elements will also be added.

```javascript
var html = htmlToPdfmake(`
  <p>
    This sentence has <span style="font-weight:bold" class="red">a bold and red word</span>.
  </p>
  `);

/*
It returns:
{
  text: [
    {
      text: 'This sentence has '
    },
    {
      text: 'a bold and red word',
      style: ['red', 'html-span'], // 'red' added because of `class="red"`
      bold: true // added because of `style="font-weight:bold"`
    },
    {
      text: '.'
    }
  ],
  margin: [0, 5, 0, 10],
  style: ['html-p']
}
*/

var docDefinition = {
 content: [
   html
 ],
 styles:{
   red:{ // we define the class called "red"
     color:'red'
   }
 }
};

var pdfDocGenerator = pdfMake.createPdf(docDefinition);
```

**Please, note that the default styles are stronger than the ones defined in the style classes.** For example, if you define a class `html-a` to change all links in *purple*, then it won't work because the default styles will overwrite it:

```javascript
var docDefinition = {
 content: [
   html
 ],
 styles:{
   'html-a':{
     color:'purple' // it won't work: all links will remain 'blue'
   }
 }
};

```

To make it work, you have to either delete the default styles, or change it with a new value. Starting `v1.1.0`, an option parameter is available as a second parameter.

Example: you want `<li>` to not have a margin-left, and `<a>` to be 'purple' and without 'underline' style:
```javascript
var html = htmlToPdfmake('<ul><li>this is <a href="...">a link</a></li><li>another item</li><li class="with-margin">3rd item with a margin</li></ul>', {
  defaultStyles:{ // change the default styles
    a:{ // for <A>
      color:'purple', // all links should be 'purple'
      decoration:'' // remove underline
    },
    li:'' // remove all default styles for <LI>
  }
});

var docDefinition = {
 content: [
   html
 ],
 styles:{
   'with-margin':{
     marginLeft: 30 // apply a margin with the specific class is used
   }
 }
};
```

#### Units

PDFMake uses `pt` units for the numbers. `html-to-pdfmake` will check the inline style to see if a number with unit is provided, then it will convert it to `pt`.

It only works for `px`, `pt`, `em` and `rem` (for `em`/`rem` it's based on `1rem = 16px`);

Examples:
  - `font-size:16px` will be converted to `fontSize:12`
  - `margin:1em` will be converted to `margin:12`

### `<img>`

If you use `html-to-pdfmake` **in a Web browser**, then you could just pass [the option `imagesByReference`](https://github.com/Aymkdn/html-to-pdfmake#imagesbyreference) with the value `true` and the images will be passed by references (starting from PDFMake v0.1.67).

Otherwise the `src` attribute must be a **base64 encoded content** (as describe in the [PDFMake documentation](https://pdfmake.github.io/docs/document-definition-object/images/)) or a reference ([see more here](https://github.com/Aymkdn/html-to-pdfmake/issues/109#issue-932953144)).

You can check [this Stackoverflow question](https://stackoverflow.com/questions/934012/get-image-data-in-javascript/42916772#42916772) to know the different ways to get a base64 encoded content from an image.

### page break

You can use [`pageBreakBefore`](https://pdfmake.github.io/docs/document-definition-object/page/) and a CSS class that you'll apply to your elements to identify when to add a page break:
```javascript
var html = htmlToPdfmake(`
  <div>
    <h1>My title on page 1</h1>
    <p>
      This is my paragraph on page 1.
    </p>
    <h1 class="pdf-pagebreak-before">My title on page 2</h1>
    <p>This is my paragraph on page 2.</p>
  </div>
`);

var docDefinition = {
  content: [
    html
  ],
  pageBreakBefore: function(currentNode) {
    return currentNode.style && currentNode.style.indexOf('pdf-pagebreak-before') > -1;
  }
};

var pdfDocGenerator = pdfMake.createPdf(docDefinition);
```

See [example.js](example.js) to see another example.

### Special properties

PDFMake provides some special attributes, like `widths` or `heights` for `table`, or `fit` for `image`, and more.
To apply these special attributes, you have to use the attribute `data-pdfmake` on your HTML elements, and then pass the special attributes as a JSON string.

```html
<!-- Example with `widths:[100,"*","auto"]` and `heights:40` to apply to a `table`. -->

<table data-pdfmake="{'widths':[100,'*','auto'],'heights':40}">
  <tr>
    <td colspan="3">Table with <b>widths=[100,"*","auto"]</b> and <b>heights=40</b></td>
  </tr>
  <tr>
    <td>Cell1</td>
    <td>Cell2</td>
    <td>Cell3</td>
  </tr>
</table>
```

The expression provided by `data-pdfmake` must be a valid JSON string because it will be translated with `JSON.parse()`.

#### `<hr>`

An `<hr>` can also be customized using `data-pdfmake`. Some default styles are applied to this element:
```javascript
{
  left:0, // the left position
  width:514, // should be OK with a A4 page
  color:'black', // the color of the line
  thickness:0.5, // how thick the line must be
  margin:[0,12,0,12] // same order as PDFMake, meaning: [left, top, right, bottom]
}
```

See the [example.js](example.js) file to see a `<hr>` example.

## Use with Node

To use it in a Node script you need to install `jsdom`:
```bash
npm install jsdom
```

Then in your JS file:
```javascript
var pdfMake = require("pdfmake/build/pdfmake");
var pdfFonts = require("pdfmake/build/vfs_fonts");
pdfMake.vfs = pdfFonts.pdfMake.vfs;
var fs = require('fs');
var jsdom = require("jsdom");
var { JSDOM } = jsdom;
var { window } = new JSDOM("");
var htmlToPdfMake = require("html-to-pdfmake");

var html = htmlToPdfMake(`<div>the html code</div>`, {window:window});

var docDefinition = {
  content: [
    html
  ]
};

var pdfDocGenerator = pdfMake.createPdf(docDefinition);
pdfDocGenerator.getBuffer(function(buffer) {
  fs.writeFileSync('example.pdf', buffer);
});
```

## Examples

You can find more examples in [example.js](example.js) which will create [example.pdf](example.pdf):

```bash
npm install
node example.js
```

## Donate

You can support my work by [making a donation](https://www.paypal.me/aymkdn), or by visiting my [Github Sponsors page](https://github.com/sponsors/Aymkdn). Thank you!
