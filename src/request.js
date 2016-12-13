const request = require('superagent');

class Request {

  constructor(generator) {
    this.generator = generator;
    this.promise = null;
    this.persistentPromise = null;
  }

  exec(context) {
    return this.generator(context);
  }

  generatePromise(spec, context) {
    const promise = new Promise((resolve, reject) => (
      setTimeout(() => {
        this.exec(context).end((err, res) => {
          this.promise = null;

          if (!!err) return reject(err);

          resolve(res.body);

          if (spec.shouldSavePromise(context, res)) {
            this.persistentPromise = promise;
          }
        });
      }, 0)
    ));

    return promise;
  }

  usePersistentPromise(spec, context) {
    return !!this.persistentPromise && spec.shouldUsePromise(context);
  }

  resolve(spec, context) {
    if (this.usePersistentPromise(spec, context)) return this.persistentPromise;
    if (!this.promise) this.promise = this.generatePromise(spec, context);

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


module.exports = {Request, createRequest};
