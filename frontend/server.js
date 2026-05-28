const http = require('http');
const fs = require('fs');
const path = require('path');

// Extract port from command-line arguments (--port XXX) or fallback to environment PORT
let portArgIndex = process.argv.indexOf('--port');
let portArg = portArgIndex !== -1 ? process.argv[portArgIndex + 1] : null;
const PORT = portArg || process.env.PORT || 8080;

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
    const reqPath = req.url.split('?')[0];
    let filePath = path.join(__dirname, reqPath === '/' ? 'index.html' : reqPath);
    
    fs.stat(filePath, (err, stats) => {
        if (!err && stats.isDirectory()) {
            filePath = path.join(filePath, 'index.html');
        }
        
        const extname = String(path.extname(filePath)).toLowerCase();
        const contentType = MIME_TYPES[extname] || 'application/octet-stream';
        
        fs.readFile(filePath, (error, content) => {
            if (error) {
                if (error.code === 'ENOENT') {
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
                // Dynamically inject API_BASE_URL environment variable into app.js at request time
                if (filePath.endsWith('app.js') && process.env.API_BASE_URL) {
                    let jsContent = content.toString('utf-8');
                    jsContent = jsContent.replace(
                        'https://personal-task-tracker-backend.onrender.com',
                        process.env.API_BASE_URL
                    );
                    res.writeHead(200, { 'Content-Type': contentType });
                    res.end(jsContent, 'utf-8');
                } else {
                    res.writeHead(200, { 'Content-Type': contentType });
                    res.end(content, 'utf-8');
                }
            }
        });
    });
});

server.listen(PORT, () => {
    console.log(`Cozy static server running on port ${PORT}`);
});
