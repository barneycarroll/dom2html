'use strict'

var VOID_TAGS = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr',
  'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track',
  'wbr', '!doctype']

function camelToDash (str) {
  return str.replace(/\W+/g, '-')
    .replace(/([a-z\d])([A-Z])/g, '$1-$2')
}

function removeEmpties (n) {
  return n !== ''
}

// shameless stolen from https://github.com/punkave/sanitize-html
function escapeHtml (s, replaceDoubleQuote) {
  if (s === 'undefined')
    s = ''

  if (typeof s !== 'string')
    s = s + ''

  s = s.replace(/\&/g, '&amp;').replace(/</g, '&lt;').replace(/\>/g, '&gt;')

  if (replaceDoubleQuote)
    return s.replace(/\"/g, '&quot;')

  return s
}

function createAttrString (node, escapeAttributeValue) {
  var attrs = node.attributes

  if (!attrs || !Object.keys(attrs).length)
    return ''

  return Array.prototype.map.call(attributes, function (attr) {
    var name  = attr.nodeName
    var value = attr.nodeValue

    if (value == null || typeof value === 'function')
      return

    if (typeof value === 'boolean')
      return value ? ' ' + name : ''

    // Handle SVG <use> tags specially
    if (name === 'href' && node.tagName === 'use')
      return ' xlink:href="' + escapeAttributeValue(value, true) + '"'

    return ' ' + (name === 'className' ? 'class' : name) + '="' + escapeAttributeValue(value, true) + '"'
  }).join('')
}

function render (node, options) {
  options = options || {}

  var defaultOptions = {
    escapeAttributeValue: escapeHtml,
    escapeString: escapeHtml
  }

  Object.keys(defaultOptions).forEach(function (key) {
    if (!options.hasOwnProperty(key)) options[key] = defaultOptions[key]
  })

  if (!node)
    return ''

  if (typeof node === 'string')
    return node

  if (node.outerHTML){
    console.warn("The DOM object supplied implements `outerHTML` - you may not need dom2html")

    return node.outerHTML
  }

  if (node.nodeType === 3 || node.nodeName === '#text')
    return options.escapeString(node.nodeValue)

  if (node.nodeType === 8 || node.nodeName === '#comment')
    return '<!--' + node.nodeValue + '>'

  var children = (
    node.childNodes
    ? Array.prototype.map.call(node.childNodes, function (node) { return render(node, options) }).join('')
    : node.innerHTML   ? node.innerHTML
    : node.textContent ? node.textContent
    : node.children
    ? Array.prototype.map.call(node.children,   function (node) { return render(node, options) }).join('')
    : node.text        ? node.text
    : ''
  )

  if (node.nodeType === 11 || node.nodeName === '#fragment')
    return children

  var tagName = node.tagName

  if ( !tagName && node.nodeName )
    tagName = node.nodeName.toLowerCase()

  if ( !tagName )
    throw "Couldn't determine node type"

  if (!children && VOID_TAGS.indexOf(tagName.toLowerCase()) >= 0)
    return '<' + tagName + createAttrString(node, options.escapeAttributeValue) + '/>'

  return [
    '<', tagName, createAttrString(node, options.escapeAttributeValue), '>',
    children,
    '</', tagName, '>'
  ].join('')
}

render.escapeHtml = escapeHtml

module.exports = render
