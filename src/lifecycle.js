const {createFactory} = require('./factory');
const {createRequest} = require('./request');

const def = {};


const proxy = (id, spec) => ({
  factory: createFactory(spec.factory),
  request: createRequest(id, spec.request),
});


const exec = (id, context) => {
  const {spec} = def[id];
  const request = spec.factory.getOrCreate(context, spec.request);

  return new Promise((resolve, reject) => request.exec(context).end((err, res) => {
    if (!!err) return reject(err);

    resolve(res.body);
  }));
};


const define = (...args) => {
  let dependencies = [];
  let id = null;
  let spec = null;

  if (Array.isArray(args[0])) {
    dependencies = args[0];
    id = args[1];
    spec = args[2];
  } else {
    id = args[0];
    spec = args[1];
  }

  def[id] = {dependencies, spec: proxy(id, spec)};
};


module.exports = {define, exec};
