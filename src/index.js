const request = require('superagent');
const {createFactory} = require('./factory');
const {define, exec} = require('./lifecycle');
const {Request} = require('./request');


module.exports = Object.assign(exec, {Request, define, request, createFactory});
