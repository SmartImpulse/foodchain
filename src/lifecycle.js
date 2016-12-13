const {createFactory} = require('./factory');
const {createRequest} = require('./request');

const def = {};


const proxy = (id, spec) => ({
  factory: createFactory(spec.factory),
  request: createRequest(id, spec.request),
});

const createGenerator = (id, context) => {
  const {spec} = def[id];
  const request = spec.factory.getOrCreate(context, spec.request);

  return () => request.resolve(context);
};

const resolveDependencies = (id, context) => {
  const {dependencies} = def[id];
  let promises = [];

  for (const depId of dependencies) {
    promises = promises.concat(resolveDependencies(depId, context));
    promises.push(createGenerator(depId, context));
  }

  return promises;
};

const callDependencies = (id, context) => Promise.all(
  resolveDependencies(id, context).map(generator => generator())
);

const exec = (id, context) => {
  const generator = createGenerator(id, context);

  return new Promise(resolve => callDependencies(id, context).then(
    () => generator().then(result => resolve(result))
  ));
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
