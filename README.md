# cmeasy beta


[![Npm Version](https://img.shields.io/npm/dm/cmeasy.svg)](https://www.npmjs.com/package/cmeasy)
[![Build Status](https://travis-ci.org/Kauabunga/cmeasy.svg)](https://travis-ci.org/Kauabunga/cmeasy)
[![Dependency Status](https://david-dm.org/Kauabunga/cmeasy.svg)](https://david-dm.org/Kauabunga/cmeasy)
[![Heroku](http://heroku-badge.herokuapp.com/?app=cmeasy&svg=1)](https://cmeasy.herokuapp.com/admin/login)
[![Code Climate](https://codeclimate.com/github/Kauabunga/cmeasy/badges/gpa.svg)](https://codeclimate.com/github/Kauabunga/cmeasy)
[![Test Coverage](https://codeclimate.com/github/Kauabunga/cmeasy/badges/coverage.svg)](https://codeclimate.com/github/Kauabunga/cmeasy/coverage)
[![Sauce Test Status](https://saucelabs.com/buildstatus/Kauabunga)](https://saucelabs.com/u/Kauabunga)


> Content API Library


## Getting Started

### Define your content

```js
require('cmeasy')(
  { 
    models: [ 
      {
        name: 'Home Page',
        singleton: true,
        definition: {
          title: {
            type: 'String',
            label: 'Home Page Title',
            default: 'Default Home Page Title'
          }
        }
      }
    ] 
  }
);
```

### Access your content

```js
require('http').get({
  host: '127.0.0.1',
  path: '/api/v1/content/homePage'
});
```

__Or__

```js

require('cmeasy')({ /* ... */ })
  .then(function(cmeasy){
    cmeasy.getModel('homePage').index();
  });

```

__Or__

```html
<script src="api/v1/content.js"></script>
<script>
  console.log(window._cmeasy_content);
</script>
```

## Installation

```bash
npm install cmeasy --save
```

## Demo

See an example running on Heroku [https://cmeasy.herokuapp.com/](https://cmeasy.herokuapp.com/admin/login)

__Or__

Deploy your own demo to Heroku [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

__Or__

See an example React app using the content on [jsfiddle.net](https://jsfiddle.net/Kauabunga/69z2wepo/27741)
___

See [server/options.js](https://github.com/Kauabunga/cmeasy/blob/master/server/options.js) for the complete demo configuration



## Features

TODO

 - Define content models via config or web client
 - Content and content model CRUD API
 - User management - with + without email service
 - 


## Options


### Connect your Express App

```js
var express = require('express');
var app = express();

require('cmeasy')(
  {
    // ...
    express: app
    // ...
  }
);

var server = require('http').createServer(app);
server.listen(9000, '127.0.0.1');

```

### Connect your Database

```js
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/cmeasy');

require('cmeasy')(
  {
    // ...
    mongoose: mongoose
    // ...
  }
);
  
```

(Changes planned to define a mongoose-like plugin interface)


### Config doc

TODO

### API doc

TODO

### Controller doc

TODO


[See website for complete API (TODO)](https://cmeasy.herokuapp.com/admin/login)


## Roadmap

TODO - Give these a priority

- Demo site showing the decouple presentation app using this library - Home Page + Blog.
- Default to using in memory database and remove Mongo requirement. Mongo support via dao plugin.
- Api-check options + Integration tests
- Refactor angular into separate project. Pure ES5/6 data layer library wrapped in angular module.
- Basic User Management / Integrations
- Basic Author/Publisher workflow
- Draft content versions / API
- Self documenting Content API
- More field types + field type plugin api
- Order property for fields presentation order in form
- JSON export / import
- Improve protractor automation coverage
- Performance test mongo
- Performance test API

## Build & Development

### Prerequisites

- [Git](https://git-scm.com/)
- [Node.js and npm](nodejs.org) Node ^4.2.3, npm ^2.14.7
- [Bower](bower.io) (`npm install --global bower`)
- [Grunt](http://gruntjs.com/) (`npm install --global grunt-cli`)
- [MongoDB](https://www.mongodb.org/) - Keep a running daemon with `mongod`

### Developing

1. Run `git clone https://github.com/Kauabunga/cmeasy.git` to clone the repository
2. Run `npm install` to install server dependencies.
3. Run `bower install` to install front-end dependencies.
4. Run `mongod` in a separate shell to keep an instance of the MongoDB Daemon running
5. Run `grunt serve` to start the development server. It should automatically open the client in your browser when ready.

### Contributing

Contributing is awesome!

Please ensure your contributions come with tests.

### Build

Run `grunt build` to build the project

## Testing

Running `npm test` will run the unit tests with karma.

 - Server: `grunt test:server`
 - Client: `grunt test:client`

## Project Structure

TODO

## Info

This project was generated with the [Angular Full-Stack Generator](https://github.com/DaftMonk/generator-angular-fullstack) version 3.1.1.
