# Roboto fontface and Material Design Icons

A simple package providing the [Roboto](http://www.google.com/fonts/specimen/Roboto) fontface and the Material Design Icons fontface. The Roboto was created by [Christian Robertson](https://plus.google.com/110879635926653430880/about).


## Installing

Assuming you have [NodeJS](http://nodejs.org/), [NPM](https://www.npmjs.com/) and [Bower](http://bower.io/) installed globally just open up a terminal, navigate to your projects root directory and then execute

```bash
# install via Bower
$ bower install roboto-and-material-icons-fonts --save
```

## Usage 

Simply include the material-icons[.min].css and the roboto[.min].css in your html file.
```html
<link rel="stylesheet" href="bower_components/roboto-and-material-icons-fonts/css/roboto.min.css">
<link rel="stylesheet" href="bower_components/roboto-and-material-icons-fonts/css/material-icons.min.css">
```

## Hinting Roboto

Some of the included font files have [hinting](http://en.wikipedia.org/wiki/Font_hinting).

| Files    | Hinting |
|----------|---------|
| `.eot`   | ?       |
| `.svg`   | no      |
| `.ttf`   | ?       |
| `.woff`  | yes     |
| `.woff2` | ?       |

## Material Icons
The recommended way to use the Material Icons font is by linking to the web font hosted on Google Fonts:

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
```

Read more in our full usage guide:
http://google.github.io/material-design-icons/#icon-font-for-the-web
