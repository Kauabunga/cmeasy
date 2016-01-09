# cmeasy

[![Build Status](https://travis-ci.org/Kauabunga/cmeasy.svg)](https://travis-ci.org/Kauabunga/cmeasy)
[![Dependency Status](https://david-dm.org/Kauabunga/cmeasy.svg)](https://david-dm.org/Kauabunga/cmeasy)
[![Heroku](http://heroku-badge.herokuapp.com/?app=cmeasy&svg=1)](https://cmeasy.herokuapp.com/)
[![Code Climate](https://codeclimate.com/github/Kauabunga/cmeasy/badges/gpa.svg)](https://codeclimate.com/github/Kauabunga/cmeasy)
[![Test Coverage](https://codeclimate.com/github/Kauabunga/cmeasy/badges/coverage.svg)](https://codeclimate.com/github/Kauabunga/cmeasy/coverage)
[![Sauce Test Status](https://saucelabs.com/buildstatus/Kauabunga)](https://saucelabs.com/u/Kauabunga)


> Content API Library


## Getting Started


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

## Installation

```bash
npm install cmeasy
```

## Demo

See an example running on Heroku @ [https://cmeasy.herokuapp.com/](https://cmeasy.herokuapp.com/)

Or

Deploy your own demo to Heroku @ [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)
 

## Options

TODO



## Features

TODO



## Roadmap

TODO



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

### Build

Run `grunt build` to build the project

## Testing

Running `npm test` will run the unit tests with karma.


## Info

This project was generated with the [Angular Full-Stack Generator](https://github.com/DaftMonk/generator-angular-fullstack) version 3.1.1.
