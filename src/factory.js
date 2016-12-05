class Factory {

  constructor(idGenerator) {
    this.idGenerator = idGenerator;
    this.requests = {};
  }

  getOrCreate(name, context, request) {
    const generated = this.idGenerator(context);
    const id = !!generated ? generated : 'default';

    if (! (id in this.requests)) this.requests[id] = request(name, context);

    return this.requests[id];
  }

}


exports.createFactory = spec => {
  let idGenerator = spec;

  if (typeof idGenerator === 'string') idGenerator = () => spec;

  return new Factory(idGenerator);
};
