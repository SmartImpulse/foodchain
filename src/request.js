const request = require('superagent');

class Request {

  constructor(generator) {
    this.generator = generator;
  }

  exec(context) {
    return this.generator(context);
  }

}


class NoRequest {

  constructor(id) {
    this.name = 'NoRequest';
    this.message = `No request defined for ${id}`;
  }

}


const createRequest = (id, spec) => {
  let generator = spec;

  if (!spec) throw new NoRequest(id);
  if (spec instanceof request.Request) generator = () => spec;

  return class extends Request {

    constructor() {
      super(generator);
    }

  };
};


module.exports = {createRequest};
