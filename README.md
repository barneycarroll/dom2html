# dom2html

***

Status: embryonic

***

Install:

```sh
npm i dom2html
```

Use:

```javascript
var dom2html = require( 'dom2html' )

var dom_like = {
  nodeType : 1,
  tagName : 'div',
  attributes : [
    {
      nodeName  : 'id',
      nodeValue : 'main'
    },
    {
      nodeName  : 'class',
      nodeValue : 'wrapper border'
    },
    {
      nodeName  : 'contenteditable',
      nodeValue : true
    }
  ],
  children : [
    {
      nodeType : 3,
      nodeValue : 'Hello'
    },
    {
      nodeType : 1,
      tagName  : 'hr'
    }
  ]
}

var html = dom2html( dom_like )
```

Results in:

```html
<div id="main" class="foo bar" contenteditable>Hello<hr/></div>
```

## What?

Convert DOM-like Javascript objects to HTML strings. DOM-like, in that only the subset of DOM necessary to produce static HTML strings is required - the vast majority of the DOM spec is irrelevant to this task, and thus most mocked DOM implementations are compliant.

## Why?

DOM libraries often use DOM mocks for the purposes of Node-based test suites. This tool was devised with the aim of taking snapshots of DOM structures during web component tests in order to produce static, visually analysable artefacts to correspond to test states. Using a DOM mock and a decent internal API allows you to easily write & execute functional tests - by integrating dom2html into the workflow you can also get a picture at salient points of the test suite, allowing you make sure your components look OK as well as passing logical tests.

## How?

I was surprised not to be able to find an existing Node library to convert DOM to HTML, but most of the necessary work has already been done - dom2html was forked from Stephan Hoyer's [mithril-node-render](https://github.com/StephanHoyer/mithril-node-render), which converts [Mithril](https://github.com/lhorie/mithril.js)'s virtual DOM structures to HTML.
