const http = require('http');
const url = require('url');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  if (request.method === 'GET') {
    switch (parsedUrl.pathname) {
      case '/':
        htmlHandler.getIndex(request, response);
        break;
      case '/style.css':
        htmlHandler.getCSS(request, response);
        break;
      case '/getUsers':
        jsonHandler.getUsers(request, response);
        break;
      case '/updateUser':
        jsonHandler.updateUser(request, response);
        break;
      default:
        jsonHandler.notFound(request, response);
    }
  } else if (request.method === 'HEAD') {
    if (parsedUrl === '/getUsers') {
      jsonHandler.getUsersMeta(request, response);
    } else {
      jsonHandler.notFoundMeta(request, response);
    }
  } else {
    jsonHandler.notFound(request, response);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
