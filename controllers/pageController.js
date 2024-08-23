const readFile =require('node:fs') 
const http = require('http')

function pageLoad() {
    readFile('../public/index.html', (err, data) => {
    if (err) throw err;

    http.createServer(function(request, response) {  
        response.writeHeader(200, {"Content-Type": "text/html"});  
        response.write(data);  
        response.end();  
    }).listen(8000);
}); 
}

module.exports = pageLoad;