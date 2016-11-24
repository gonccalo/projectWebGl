fs = require('fs');
http = require('http');
url = require('url');


http.createServer(function(req, res){
  var request = url.parse(req.url, true);
  var action = request.pathname;

  if (action == '/logo.gif') {
     var img = fs.readFileSync('./ttt.gif');
     res.writeHead(200, {'Content-Type': 'image/gif' });
     res.end(img, 'binary');
  } else { 
     res.writeHead(200, {'Content-Type': 'text/plain' });
     res.end('Hello World \n');
  }
}).listen(8080, '127.0.0.1');