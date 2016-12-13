const request = require('superagent');

class Request {

  constructor(generator) {
    this.generator = generator;
    this.promise = null;
  }

  exec(context) {
    return this.generator(context);
  }

  resolve(context) {
    if (!this.promise) {
      this.promise = new Promise((resolve, reject) => this.exec(context).end((err, res) => {
        if (!!err) return reject(err);

        resolve(res.body);
        this.promise = null;
      }));
    }

    return this.promise;
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
