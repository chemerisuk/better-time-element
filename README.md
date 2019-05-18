# better-time-element<br>[![NPM version][npm-version]][npm-url] [![NPM downloads][npm-downloads]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Twitter][twitter-follow]][twitter-url]
> Useful `<time>` element extensions using [better-dom](https://github.com/chemerisuk/better-dom)

[LIVE DEMO](http://chemerisuk.github.io/better-time-element/)

## Features
* represents time in localized format via custom element `<local-time>`
* [live extension](https://github.com/chemerisuk/better-dom/wiki/Live-extensions) - works for current and future content
* [custom formats](https://github.com/chemerisuk/better-time-element#change-display-date-presentation) supported via `data-format`

## Installing
```sh
$ npm install better-time-element better-dom
```
Then append the following tags on your page:

```html
<script src="node_modules/better-dom/dist/better-dom.js"></script>
<script src="node_modules/better-time-element/dist/better-time-element.js"></script>
```

## Change display date presentation
Version 2 uses [Intl](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) methods to format presented date value according to the current page locale. You can customize it by specifying `data-format` attribute with [options for the Date#toLocaleString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString) call as a stringified JSON object:

```html
<local-time datetime="2013-11-08T21:12:52.000Z" data-format='{"month":"short","year":"numeric","day":"numeric"}'></local-time>
```

When you set the same presentation format multiple times it makes sense to define a global format. Add extra `<meta>` element with appropriate values for `name` and `content` attributes into document `<head>`. Later in HTML you can just use a global format name as a value for `data-format`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    ...
    <meta name="data-format:timeOnly" content='{"hour":"numeric","minute":"numeric","second":"numeric"}'>
</head>
<body>
    ...
    <local-time datetime="2013-11-08T21:12:52.000Z" data-format="timeOnly"></local-time>
</body>
</html>
```

## Browser support
#### Desktop
* Chrome
* Safari
* Firefox
* Opera
* Edge
* Internet Explorer 10+

#### Mobile
* iOS Safari 7+
* Chrome for Android 30+

[npm-url]: https://www.npmjs.com/package/better-time-element
[npm-version]: https://img.shields.io/npm/v/better-time-element.svg
[npm-downloads]: https://img.shields.io/npm/dm/better-time-element.svg

[travis-url]: http://travis-ci.org/chemerisuk/better-time-element
[travis-image]: http://img.shields.io/travis/chemerisuk/better-time-element/master.svg

[coveralls-url]: https://coveralls.io/r/chemerisuk/better-time-element
[coveralls-image]: http://img.shields.io/coveralls/chemerisuk/better-time-element/master.svg

[twitter-url]: https://twitter.com/chemerisuk
[twitter-follow]: https://img.shields.io/twitter/follow/chemerisuk.svg?style=social&label=Follow%20me
