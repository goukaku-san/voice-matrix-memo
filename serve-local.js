// ローカル確認専用の簡易サーバ（本番には使わない・GitHub Pagesには不要）
// マイクとService Workerは安全なオリジンでしか動かないため http://localhost で開く
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = __dirname, PORT = 8787;
const TYPE = {
  '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8',
  '.json':'application/manifest+json', '.png':'image/png', '.txt':'text/plain; charset=utf-8'
};
http.createServer((req, res) => {
  let u = decodeURIComponent(req.url.split('?')[0]);
  if (u === '/') u = '/index.html';
  const fp = path.join(ROOT, path.normalize(u).replace(/^[\\/]+/, ''));
  if (!fp.startsWith(ROOT)) { res.writeHead(403); return res.end('403'); }
  fs.readFile(fp, (err, data) => {
    if (err) { res.writeHead(404); return res.end('404'); }
    res.writeHead(200, { 'Content-Type': TYPE[path.extname(fp)] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(PORT, '127.0.0.1', () => console.log('http://localhost:' + PORT + '/ で待受中'));
