const request = require('superagent');


class NoRequest {

  constructor(id) {
    this.name = 'NoRequest';
    this.message = `No request defined for ${id}`;
  }

}


const createRequest = (id, spec) => {
  if (!spec) throw new NoRequest(id);
  if (spec instanceof request.Request) return () => spec;

  return spec;
};


module.exports = {createRequest};
