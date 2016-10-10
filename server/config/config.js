// import convict from 'convict';
const convict = require('convict');

const config = convict({
  NODE_ENV: {
    doc: 'The applicaton environment.',
    format: [
      'production',
      'development',
      'staging',
      'test'
    ],
    default: 'production',
    env: 'NODE_ENV'
  },
  CMS_SESSION_SECRET: {
    doc: 'The secret used to encrypt session information',
    format: String,
    default: null,
    env: 'CMS_SESSION_SECRET'
  },
  CMS_MONGO_URL: {
    doc: 'The CMS mongodb connection string',
    format: String,
    default: 'mongodb://localhost/cmeasy',
    env: 'CMS_MONGO_URL'
  },
  CMS_PORT: {
    doc: 'The port to bind CMS admin to',
    format: Number,
    default: 3000,
    env: 'PORT'
  },
  CMS_IP: {
    doc: 'The hostname/IP for the cms',
    format: String,
    default: 'localhost',
    env: 'CMS_IP'
  }
});

config.validate();

module.exports = config;
