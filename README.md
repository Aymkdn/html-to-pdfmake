# html-to-pdfmake

[pdfmake](https://pdfmake.github.io/docs/) permits to easily create a PDF with JavaScript, but the support of HTML was missing. After [reviewing issue #205](https://github.com/bpampuch/pdfmake/issues/205) I decided to create a module to handle this feature.

## Online Demo

You can find the online demo at <a href="https://aymkdn.github.io/html-to-pdfmake/">https://aymkdn.github.io/html-to-pdfmake/</a>

## Install

```bash
npm install html-to-pdfmake
```

## How to use

This module will convert some basic and valid HTML code to its equivalent in *pdfmake*.

```javascript
var pdfMake = require("pdfmake/build/pdfmake");
var pdfFonts = require("pdfmake/build/vfs_fonts");
pdfMake.vfs = pdfFonts.pdfMake.vfs;
var htmlToPdfMake = require("html-to-pdfmake");

var html = htmlToPdfMake(`
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

## Documentation

### HTML tags supported

The below HTML tags are supported:
  - DIV / P / SPAN
  - BR
  - B / STRONG
  - I / EM
  - UL / OL / LI
  - TABLE / THEAD / TBODY / TFOOTER / TR / TH / TD
  - H1 to H6
  - IMG

### Default style

I've defined some default styles for the supported element.

For example, using a &lt;STRONG&gt; will display the word in **bold**. Or, a link will appear in blue with an underline, and so on...

### Customize style

Each converted element will have an associated style-class called `html-tagname`.

For example, if you want all &lt;STRONG&gt; tags to be highlighted with a yellow backgroud you can use `html-strong` in the `styles` definition:

```javascript
var html = htmlToPdfMake(`
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
var html = htmlToPdfMake(`
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

### `<img>`

The `<img>` tag is supported, however the `src` attribute must already be a **base64 encoded content** (as describe in the [PDFMake documentation](https://pdfmake.github.io/docs/document-definition-object/images/)).

This is too complex and out of the scope of this module to find and convert the image source to a base64 format. You can check [this Stackoverflow question](https://stackoverflow.com/questions/934012/get-image-data-in-javascript/42916772#42916772) to know the different ways to get a base64 encoded content from an image.

## Examples

You can find more examples in [example.js](example.js) which will create [example.pdf](example.pdf):

```bash
node example.js
```
