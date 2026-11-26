import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';

const server = spawn(process.execPath, ['node_modules/astro/bin/astro.mjs', 'preview', '--host', '127.0.0.1', '--port', '4329'], { stdio: 'pipe' });
try {
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Preview no inició en 20 segundos')), 20000);
    server.on('error', reject);
    server.on('exit', (code) => reject(new Error(`Preview terminó: ${code}`)));
    server.stdout.on('data', (chunk) => {
      if (chunk.toString().includes('4329')) { clearTimeout(timeout); resolve(); }
    });
    server.stderr.on('data', (chunk) => process.stderr.write(chunk));
  });
  for (const path of ['/', '/servicios/', '/sobre/', '/contacto/', '/contacto', '/robots.txt', '/sitemap.xml', '/ruta-inexistente-auditoria/', '/ruta-inexistente-auditoria']) {
    const response = await fetch(`http://127.0.0.1:4329${path}`);
    assert.equal(response.status, path.includes('inexistente') ? 404 : 200, path);
    if (response.status === 404) {
      assert.match(await response.text(), /class="idea-highlight"[^>]*>no encontrada</);
    } else if (path.startsWith('/contacto')) {
      const html = await response.text();
      assert.equal((html.match(/href="\/policy\/"/g) ?? []).length, 1);
      assert.match(html, /<footer\b[\s\S]*href="\/policy\/"/);
    }
    console.log(`${response.status} ${path}`);
  }
} finally {
  server.kill();
}
