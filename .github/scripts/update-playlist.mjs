import { readFileSync, writeFileSync } from 'node:fs';

const argv = process.argv.slice(2);

function arg(name) {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] !== undefined ? argv[i + 1] : '';
}

function cleanTitle(raw) {
  let t = raw.replace(/\s*\|\s*Suno\s*$/i, '').trim();
  const at = t.search(/\s+by\s+/i);
  if (at !== -1) t = t.slice(0, at).trim();
  return t;
}

async function fetchTitle(uuid) {
  try {
    const res = await fetch(`https://suno.com/embed/${uuid}`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
      },
    });
    if (!res.ok) return '';
    const text = await res.text();
    const m = text.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    return m ? cleanTitle(m[1]) : '';
  } catch {
    return '';
  }
}

async function main() {
  const file = arg('file') || 'src/public/script.js';
  const action = arg('action');
  const link = arg('link').trim();
  const id = arg('id').trim();
  const title = arg('title').trim();
  const numberRaw = arg('number').trim();
  const number = numberRaw === '' ? NaN : Number(numberRaw);

  const rawId = (link || id).trim();
  const rawIds = rawId ? rawId.split(/[\s,]+/).filter(Boolean) : [];
  const uuids = [];
  for (const raw of rawIds) {
    const m = raw.match(
      /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i
    );
    if (m) uuids.push(m[1]);
  }

  const wantRemove = action === 'remove' || (action === '' && Number.isInteger(number));
  const wantAdd = action === 'add' || (action === '' && uuids.length > 0);

  if (action !== '' && action !== 'add' && action !== 'remove') {
    console.error('Ação inválida. Use --action add, --action remove ou nenhuma (faz as duas).');
    process.exit(1);
  }
  if (!wantAdd && !wantRemove) {
    console.error('Informe um ou mais links/UUIDs (para adicionar) e/ou um número (para remover).');
    process.exit(1);
  }
  if (wantAdd && uuids.length === 0) {
    console.error(
      'Link inválido. Coloque um ou mais links do Suno ou UUIDs, separados por vírgula ou quebra de linha.'
    );
    process.exit(1);
  }
  const skipped = rawIds.length - uuids.length;
  if (skipped > 0) {
    console.log(`Aviso: ${skipped} link(s) sem UUID válido foram ignorados.`);
  }
  if (wantRemove && (!Number.isInteger(number) || number < 1)) {
    console.error('Número de remoção inválido. Informe um valor positivo (1-based).');
    process.exit(1);
  }

  const html = readFileSync(file, 'utf8');
  const match = html.match(/const songs = \[([\s\S]*?)\n\s*\];/);
  if (!match) {
    console.error('Array songs não encontrado no arquivo.');
    process.exit(1);
  }

  const entries = [];
  for (const line of match[1].split('\n')) {
    const obj = line.match(/{\s*id:\s*"([0-9a-f-]+)"\s*,\s*title:\s*"((?:[^"\\]|\\.)*)"\s*}/i);
    if (obj) {
      entries.push({ id: obj[1], title: obj[2] });
    } else {
      const url = line.match(/"https:\/\/suno\.com\/embed\/([0-9a-f-]+)"/i);
      if (url) {
        entries.push({ id: url[1], title: `Música ${entries.length + 1}` });
      }
    }
  }

  if (entries.length === 0) {
    console.error('Nenhuma música encontrada no array songs.');
    process.exit(1);
  }

  const ops = [];

  if (wantRemove) {
    if (number > entries.length) {
      console.error(`Número inválido. Informe um valor entre 1 e ${entries.length}.`);
      process.exit(1);
    }
    const removed = entries.splice(number - 1, 1);
    ops.push(`removida #${number} - ${removed[0].title}`);
  }

  if (wantAdd) {
    const useSingleTitle = title !== '' && uuids.length === 1;
    if (title !== '' && uuids.length > 1) {
      console.log(
        'Vários links informados: o campo "Nome da música" será ignorado e os títulos serão buscados na Suno.'
      );
    }
    for (const uuid of uuids) {
      const existing = entries.findIndex((e) => e.id === uuid);
      if (existing !== -1) {
        ops.push(`duplicada #${existing + 1} - ${entries[existing].title} (não adicionada)`);
        continue;
      }
      let finalTitle = useSingleTitle ? title : '';
      if (!finalTitle) {
        console.log(`Buscando título na Suno para ${uuid}...`);
        finalTitle = await fetchTitle(uuid);
      }
      entries.push({ id: uuid, title: finalTitle || `Música ${entries.length + 1}` });
      ops.push(`adicionada #${entries.length} - ${entries[entries.length - 1].title}`);
    }
  }

  const block =
    'const songs = [\n' +
    entries
      .map((e) => `      { id: "${e.id}", title: ${JSON.stringify(e.title)} },`)
      .join('\n') +
    '\n    ];';

  const next =
    html.slice(0, match.index) +
    block +
    html.slice(match.index + match[0].length);

  writeFileSync(file, next, 'utf8');

  console.log(`Playlist atualizada (${entries.length} músicas):`);
  ops.forEach((o) => console.log(`- ${o}`));
  entries.forEach((e, i) => console.log(`${i + 1} - ${e.title}`));
}

main();