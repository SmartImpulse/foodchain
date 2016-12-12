class Factory {

  constructor(idGenerator) {
    this.idGenerator = idGenerator;
    this.requests = {};
  }

  getOrCreate(context, RequestConstructor) {
    const generated = this.idGenerator(context);
    const id = !!generated ? generated : 'default';

    if (! (id in this.requests)) this.requests[id] = new RequestConstructor();

    return this.requests[id];
  }

}


exports.createFactory = (spec) => {
  let idGenerator = spec;

  if (!spec) {
    idGenerator = () => 'default';
  } else if (typeof idGenerator === 'string') {
    idGenerator = () => spec;
  }

  return new Factory(idGenerator);
};
