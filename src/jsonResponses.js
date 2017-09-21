// Node's built-in cryptography module.
const crypto = require('crypto');

// Note this object is purely in memory
const users = {};

// sha1 is a bit of a quicker hash algorithm for insecure things
let etag = crypto.createHash('sha1').update(JSON.stringify(users));
// grab the hash as a hex string
let digest = etag.digest('hex');

const respondJSON = (request, response, status, object) => {
  const headers = {
    'Content-Type': 'application/json',
    etag: digest,
  };
  response.writeHead(status, headers);
  response.write(JSON.stringify(object));
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  const headers = {
    'Content-Type': 'application/json',
    etag: digest,
  };
  response.writeHead(status, headers);
  response.end();
};

const getUsers = (request, response) => {
  const responseJSON = {
    users,
  };
  if (request.headers['if-none-match'] === digest) {
    return respondJSONMeta(request, response, 304);
  }
  return respondJSON(request, response, 200, responseJSON);
};

const updateUser = (request, response) => {
  const newUser = {
    createdAt: Date.now(),
  };
  users[newUser.createdAt] = newUser;
  etag = crypto.createHash('sha1').update(JSON.stringify(users));
  digest = etag.digest('hex');

  return respondJSON(request, response, 201, newUser);
};

const getUsersMeta = (request, response) => {

};

const notFound = (request, response) => {

};

const notFoundMeta = (request, response) => {

};

module.exports = {
  getUsers,
  getUsersMeta,
  updateUser,
  notFound,
  notFoundMeta,
};
