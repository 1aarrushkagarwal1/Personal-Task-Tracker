const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    // Safely parse URL path and strip query strings / hash fragments
    const reqPath = req.url.split('?')[0];
    let filePath = path.join(__dirname, reqPath === '/' ? 'index.html' : reqPath);
    
    // Directory check fallback to index.html
    fs.stat(filePath, (err, stats) => {
        if (!err && stats.isDirectory()) {
            filePath = path.join(filePath, 'index.html');
        }
        
        const extname = String(path.extname(filePath)).toLowerCase();
        const contentType = MIME_TYPES[extname] || 'application/octet-stream';
        
        fs.readFile(filePath, (error, content) => {
            if (error) {
                if (error.code === 'ENOENT') {
                    // Fallback to index.html for routing or SPA behavior
                    fs.readFile(path.join(__dirname, 'index.html'), (errHtml, htmlContent) => {
                        if (errHtml) {
                            res.writeHead(404, { 'Content-Type': 'text/plain' });
                            res.end('404 Not Found');
                        } else {
                            res.writeHead(200, { 'Content-Type': 'text/html' });
                            res.end(htmlContent, 'utf-8');
                        }
                    });
                } else {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end(`Server Error: ${error.code}`);
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
    });
});

server.listen(PORT, () => {
    console.log(`Cozy static server running on port ${PORT}`);
});
