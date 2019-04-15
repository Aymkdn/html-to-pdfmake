# html-to-pdfmake

[pdfmake](https://pdfmake.github.io/docs/) permits to easily create a PDF with JavaScript, but the support of HTML was missing. After [reviewing issue #205](https://github.com/bpampuch/pdfmake/issues/205) I decided to create a module to handle this feature.

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
{ stack:
  [
    { text: 'My title',
      fontSize: 24,
      bold: true,
      marginBottom: 5,
      style: [ 'html-h1' ]
    },
    { text:
      [
        { text: 'This is a sentence with a ', margin: [ 0, 5, 0, 10 ] },
        { text: 'bold word', bold: true, style: [ 'html-strong' ] },
        { text: ', ', margin: [ 0, 5, 0, 10 ] },
        { text: 'one in italic', italics: true, style: [ 'html-em' ] },
        { text: ', and ', margin: [ 0, 5, 0, 10 ] },
        { text: 'one with underline',
          decoration: 'underline',
          style: [ 'html-u' ] },
        { text: '. And finally ', margin: [ 0, 5, 0, 10 ] },
        { text: 'a link',
          color: 'blue',
          decoration: 'underline',
          link: 'https://www.somewhere.com',
          style: [ 'html-a' ] },
        { text: '.', margin: [ 0, 5, 0, 10 ] }
      ],
      style: [ 'html-p' ]
    }
  ],
  style: [ 'html-div' ]
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

### Default style

I've defined some default styles for the supported element.

For example, using a &lt;STRONG&gt; will display the word in **bold**. Or, a link will appear in blue with an underline, and so on...

### Customize style

Each converted element will have an associated style-class called `html-TAGNAME`.

For example, if you want all **STRONG** tags to be highlighted with a yellow backgroud you can use `html-strong` in the `styles` definition:

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

The classed passed to the elements will be added, as well as the `style`.

```javascript
var html = htmlToPdfMake(`
  <p>
    This sentence has <span style="font-weight:bold" class="red">a bold and red word</span>.
  </p>
  `);

/*
It returns:
{
  text: [{
      text: 'This sentence has ',
      margin: [0, 5, 0, 10]
    },
    {
      text: 'a bold and red word',
      style: ['red', 'html-span'], // two classes will be applied: 'red' and 'html-span'
      bold: true // the `font-weight:bold` has been translated to `bold:true`
    },
    {
      text: '.',
      margin: [0, 5, 0, 10]
    }
  ],
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

## Examples

You can find more examples in [example.js](example.js) which will create [example.pdf](example.pdf):

```bash
node example.js
```
