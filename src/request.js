import superagent from 'superagent';
import superagentPromise from 'superagent-promise';


class Request {

  constructor(name, context, spec) {
    this.name = name;
    this.context = context;
    this.spec = spec;
    this.client = superagentPromise(superagent, Promise);
    this.promise = null;
  }

  boolOrCall(specName, ...args) {
    if (typeof this.spec[specName] === 'function') {
      return this.spec[specName](...args) === true;
    }

    return this.spec[specName] === true;
  }

  shouldUsePromise(specName, ...args) {
    return this.boolOrCall('shouldUsePromise', ...args);
  }

  shouldSavePromise(specName, ...args) {
    return this.boolOrCall('shouldSavePromise', ...args);
  }

  exec() {
    let promise = null;

    if (!!this.promise && this.shouldUsePromise) return this.promise;
    
    promise = new Promise((resolve, reject) => {
      this.spec.exec(this.client, this.context).catch(reject).then(result => {
        if (this.shouldSavePromise(result, context)) this.promise = promise;

        resolve(result);
      });
    });

  }

}






const createRequest = spec => {
  const lifeCycle = spec;

  if (typeof spec === 'function') lifeCycle = {exec: spec};

  return (name, context) => new Request(name, context, spec);
};