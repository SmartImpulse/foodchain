const request = require('superagent');
const {createFactory} = require('./factory');
const {define, exec} = require('./lifecycle');

module.exports = Object.assign(exec, {define, request, createFactory});
