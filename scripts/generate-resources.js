const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const NOTES_DIR = path.join(ROOT_DIR, 'pdf', 'Notes');
const PYQS_DIR = path.join(ROOT_DIR, 'pdf', 'PYQs');
const OUTPUT_FILE = path.join(ROOT_DIR, 'js', 'resources-data.json');

// Helper to format bytes
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// Recursively get all files
function getFiles(dir, category, subjectName = '') {
  let results = [];
  if (!fs.existsSync(dir)) return results;

  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat && stat.isDirectory()) {
      // If we are at the top level of Notes/PYQs, the subdirectories represent subjects
      const subSubject = subjectName ? subjectName : file;
      results = results.concat(getFiles(filePath, category, subSubject));
    } else {
      // Only include actual files (exclude system files like .DS_Store)
      if (file.startsWith('.')) return;

      const ext = path.extname(file).toLowerCase();
      const relativePath = path.relative(ROOT_DIR, filePath).replace(/\\/g, '/');

      results.push({
        name: file,
        path: relativePath,
        category: category,
        subject: subjectName || 'General',
        size: formatBytes(stat.size),
        type: ext.substring(1) || 'file'
      });
    }
  });

  return results;
}

function run() {
  console.log('Scanning directories...');
  const notesFiles = getFiles(NOTES_DIR, 'notes');
  const pyqFiles = getFiles(PYQS_DIR, 'pyqs');

  // Let's also add static tools that don't change
  const tools = [
    {
      name: 'Academic helper toolkit',
      path: 'calculator.html',
      category: 'tools',
      subject: 'Utilities',
      size: 'Internal',
      type: 'tool'
    },
    {
      name: 'Revision planner',
      path: 'attendance.html',
      category: 'tools',
      subject: 'Utilities',
      size: 'Internal',
      type: 'tool'
    }
  ];

  const allResources = [...notesFiles, ...pyqFiles, ...tools];
  
  // Create js directory if it doesn't exist
  const jsDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(jsDir)) {
    fs.mkdirSync(jsDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allResources, null, 2), 'utf-8');
  console.log(`Successfully generated ${allResources.length} resources in ${OUTPUT_FILE}`);
}

run();
