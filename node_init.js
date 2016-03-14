var util = require('util'),
  http = require('http'),
  fs = require('fs');

fs.readFile('./demo/blog-demo.html', function (err, content) {
  if (err) {
    throw err; 
  }
  http.createServer(function(request, response) {  
    util.puts(request.url);
    if(request.url === "/") {
      response.writeHeader(200, {"Content-Type": "text/html"});
      response.write(content);
      response.end();
    } else if(request.url === "/dist/jquery.smartify.min.js") {
      fs.readFile('.' + request.url, function (err, content) {
        if (err) {
          throw err; 
        }
        response.writeHeader(200, {"Content-Type": "text/javascript"});
        response.write(content);
        response.end();
      });
    } else if(request.url === "/demo/ajax-content.html") {
      fs.readFile('.' + request.url, function (err, content) {
        if (err) {
          throw err; 
        }
        response.writeHeader(200, {"Content-Type": "text/html"});
        response.write(content);
        response.end();
      });
    }
  }).listen(8080, '127.0.0.1');
  util.puts('> Server running at http://127.0.0.1:8080/');
});



