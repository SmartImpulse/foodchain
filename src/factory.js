class Factory {

  constructor(idGenerator) {
    this.idGenerator = idGenerator;
    this.requests = {};
  }

  getOrCreate(context, request) {
    const id = this.idGenerator(context);

    if (! (id in this.requests)) this.requests[id] = request(context);

    return this.requests[id];
  }

}


exports.createFactory = spec => {
  let idGenerator = spec;

  if (typeof idGenerator === 'string') idGenerator = () => spec;

  return new Factory(idGenerator);
};
