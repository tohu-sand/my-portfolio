const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const repoRoot = process.cwd();

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function normalizeText(text) {
  return text.replace(/\r\n/g, '\n').replace(/[ \t]+$/gm, '').trim();
}

function stripCopyrightLines(text) {
  const lines = text.split(/\r?\n/).filter((line) => {
    const trimmed = line.trim();
    if (!trimmed) return true;
    if (/^copyright\b/i.test(trimmed)) return false;
    if (/^all rights reserved\.?$/i.test(trimmed)) return false;
    return true;
  });
  return normalizeText(lines.join('\n'));
}

function findLicenseFiles(pkgPath) {
  let entries = [];
  try {
    entries = fs.readdirSync(pkgPath, { withFileTypes: true });
  } catch (error) {
    return [];
  }
  const files = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => /^(licen[cs]e|copying|notice|copyright)/i.test(name));
  files.sort((a, b) => a.localeCompare(b));
  return files;
}

function isLikelyCopyrightLine(trimmed) {
  if (!/^copyright\b/i.test(trimmed)) return false;
  const lowered = trimmed.toLowerCase();
  if (lowered.startsWith('copyright notice')) return false;
  if (lowered.startsWith('copyright holder')) return false;
  if (lowered.startsWith('copyright holders')) return false;
  if (lowered.startsWith('copyright license')) return false;
  if (lowered.startsWith('copyright permission')) return false;
  if (lowered.startsWith('copyright and related rights')) return false;
  if (/\[yyyy\]/i.test(trimmed)) return false;
  if (/\[name of copyright owner\]/i.test(trimmed)) return false;
  if (!/(\(c\)|\u00A9|\d|<|@|https?:\/\/)/i.test(trimmed)) return false;
  return true;
}

function extractCopyrightLines(pkgPaths) {
  const notices = new Set();
  for (const pkgPath of pkgPaths) {
    const files = findLicenseFiles(pkgPath);
    for (const file of files) {
      const filePath = path.join(pkgPath, file);
      let contents;
      try {
        contents = readText(filePath);
      } catch (error) {
        continue;
      }
      for (const line of contents.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        if (isLikelyCopyrightLine(trimmed)) {
          notices.add(trimmed.replace(/\s+$/, ''));
        }
      }
    }
  }
  return Array.from(notices).sort((a, b) => a.localeCompare(b));
}

function loadLicenseText(source, packageLookup) {
  let text;
  if (source.type === 'file') {
    text = readText(source.path);
  } else if (source.type === 'package') {
    const pkg = packageLookup.get(source.name);
    if (!pkg) {
      throw new Error(`Package not found for license text: ${source.name}`);
    }
    const pkgPath = pkg.paths[0];
    const licenseFiles = findLicenseFiles(pkgPath);
    if (!licenseFiles.length) {
      throw new Error(`No license file found in ${pkgPath}`);
    }
    const filePath = path.join(pkgPath, licenseFiles[0]);
    text = readText(filePath);
  } else {
    throw new Error(`Unknown license text source type: ${source.type}`);
  }

  text = normalizeText(text);
  if (source.stripCopyright) {
    text = stripCopyrightLines(text);
  }
  return text;
}

function loadLicenseTextFromSources(licenseId, sources, packageLookup, licenseData) {
  const errors = [];
  for (const source of sources) {
    try {
      return loadLicenseText(source, packageLookup);
    } catch (error) {
      errors.push(error);
    }
  }

  const packages = licenseData[licenseId] || [];
  for (const pkg of packages) {
    const pkgPath = pkg.paths[0];
    const licenseFiles = findLicenseFiles(pkgPath);
    if (!licenseFiles.length) {
      continue;
    }
    try {
      const text = normalizeText(readText(path.join(pkgPath, licenseFiles[0])));
      return text;
    } catch (error) {
      errors.push(error);
    }
  }

  const errorMessages = errors.map((error) => error.message).join('; ');
  throw new Error(`Unable to find license text for ${licenseId}. ${errorMessages}`);
}

function findInfoJsonAuthor(pkgPath) {
  const infoPath = path.join(pkgPath, 'info.json');
  if (!fs.existsSync(infoPath)) return null;
  try {
    const info = JSON.parse(readText(infoPath));
    if (info && info.author && info.author.name) {
      return info.author.name;
    }
  } catch (error) {
    return null;
  }
  return null;
}

const licenseJson = execSync('pnpm licenses list --json', { encoding: 'utf8' });
const licenseData = JSON.parse(licenseJson);

const packageLookup = new Map();
for (const packages of Object.values(licenseData)) {
  for (const pkg of packages) {
    packageLookup.set(pkg.name, pkg);
  }
}

const noticeFallbacks = new Map([
  ['@esbuild/linux-x64', 'esbuild']
]);

const licenseTextSources = {
  'MIT': [
    { type: 'file', path: path.join(repoRoot, 'LICENSE'), stripCopyright: true }
  ],
  'ISC': [
    { type: 'package', name: 'once', stripCopyright: true }
  ],
  'Apache-2.0': [
    { type: 'package', name: '@swc/helpers', stripCopyright: false }
  ],
  'BSD-2-Clause': [
    { type: 'package', name: 'css-select', stripCopyright: true }
  ],
  'BSD-3-Clause': [
    { type: 'package', name: 'source-map-js', stripCopyright: true }
  ],
  'CC0-1.0': [
    { type: 'package', name: 'mdn-data', stripCopyright: false }
  ],
  'CC-BY-4.0': [
    { type: 'package', name: 'caniuse-lite', stripCopyright: false }
  ],
  'LGPL-3.0-or-later': [
    { type: 'file', path: path.join(repoRoot, 'licenses', 'LGPL-3.0.txt'), stripCopyright: false }
  ],
  'Python-2.0': [
    { type: 'package', name: 'argparse', stripCopyright: false }
  ],
  'BlueOak-1.0.0': [
    { type: 'package', name: 'jackspeak', stripCopyright: false }
  ],
  '0BSD': [
    { type: 'package', name: 'tslib', stripCopyright: true }
  ]
};

const licenseOrder = [
  'MIT',
  'Apache-2.0',
  'ISC',
  'BSD-2-Clause',
  'BSD-3-Clause',
  '0BSD',
  'BlueOak-1.0.0',
  'CC0-1.0',
  'CC-BY-4.0',
  'LGPL-3.0-or-later',
  'Python-2.0',
  '(MIT OR CC0-1.0)'
].filter((licenseId) => licenseData[licenseId]);

const extraNoticePatterns = [/this license applies to/i, /third[- ]party/i];
const extraNotices = [];

function collectExtraNotices(pkg, pkgPath) {
  const licenseFiles = findLicenseFiles(pkgPath);
  for (const file of licenseFiles) {
    const filePath = path.join(pkgPath, file);
    let content;
    try {
      content = readText(filePath);
    } catch (error) {
      continue;
    }
    if (extraNoticePatterns.some((pattern) => pattern.test(content))) {
      extraNotices.push({
        packageName: pkg.name,
        versions: pkg.versions,
        file: file,
        content: normalizeText(content)
      });
    }
  }
}

const output = [];
output.push('# Third-Party Licenses');
output.push('');
output.push('This file lists third-party packages used by this repository (direct and transitive) and provides their license texts and required notices.');
output.push('The list is based on the currently installed dependency tree (pnpm).');
output.push('');
output.push('## Packages By License');

for (const licenseId of licenseOrder) {
  const packages = licenseData[licenseId] || [];
  const sortedPackages = packages.slice().sort((a, b) => a.name.localeCompare(b.name));

  output.push('');
  output.push(`### ${licenseId}`);
  if (licenseId === '(MIT OR CC0-1.0)') {
    output.push('Dual-licensed; see MIT and CC0-1.0 license texts below.');
  }
  output.push('');
  for (const pkg of sortedPackages) {
    const versions = pkg.versions.join(', ');
    const notices = extractCopyrightLines(pkg.paths);
    let noticeText = '';
    if (notices.length) {
      noticeText = ` — ${notices.join('; ')}`;
    } else if (pkg.author) {
      noticeText = ` — Copyright (c) ${pkg.author}`;
    } else {
      const infoAuthor = pkg.paths.map(findInfoJsonAuthor).find(Boolean);
      if (infoAuthor) {
        noticeText = ` — Author: ${infoAuthor}`;
      }
    }
    if (!noticeText) {
      const fallbackName = noticeFallbacks.get(pkg.name);
      if (fallbackName) {
        const fallbackPkg = packageLookup.get(fallbackName);
        if (fallbackPkg) {
          const fallbackNotices = extractCopyrightLines(fallbackPkg.paths);
          if (fallbackNotices.length) {
            noticeText = ` — ${fallbackNotices.join('; ')}`;
          }
        }
      }
    }

    output.push(`- ${pkg.name}@${versions}${noticeText}`);

    for (const pkgPath of pkg.paths) {
      collectExtraNotices(pkg, pkgPath);
    }
  }
}

output.push('');
output.push('## License Texts');

for (const licenseId of licenseOrder) {
  if (licenseId === '(MIT OR CC0-1.0)') {
    output.push('');
    output.push('### MIT OR CC0-1.0');
    output.push('The packages under this license are dual-licensed; see the MIT and CC0-1.0 texts above.');
    continue;
  }

  const sources = licenseTextSources[licenseId] || [];
  if (!sources.length) {
    continue;
  }
  const text = loadLicenseTextFromSources(licenseId, sources, packageLookup, licenseData);

  output.push('');
  output.push(`### ${licenseId}`);
  output.push('```text');
  output.push(text);
  output.push('```');
}

if (extraNotices.length) {
  output.push('');
  output.push('## Additional Package Notices');

  const deduped = new Map();
  for (const notice of extraNotices) {
    const key = `${notice.packageName}@${notice.versions.join(', ')}::${notice.file}`;
    if (!deduped.has(key)) {
      deduped.set(key, notice);
    }
  }

  for (const notice of Array.from(deduped.values()).sort((a, b) => a.packageName.localeCompare(b.packageName))) {
    output.push('');
    output.push(`### ${notice.packageName}@${notice.versions.join(', ')} (${notice.file})`);
    output.push('```text');
    output.push(notice.content);
    output.push('```');
  }
}

fs.writeFileSync(path.join(repoRoot, 'THIRD_PARTY_LICENSES.md'), output.join('\n') + '\n');
