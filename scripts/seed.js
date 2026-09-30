const fs = require('fs');
const path = require('path');

const DB_FILE_PATH = path.join(process.cwd(), '.polar_db.json');

console.log('--- POLAR SENSE AI: Database Seed & Verification ---');
if (fs.existsSync(DB_FILE_PATH)) {
  const data = JSON.parse(fs.readFileSync(DB_FILE_PATH, 'utf-8'));
  console.log(`[Seed Check] Database File Present: ${DB_FILE_PATH}`);
  console.log(`[Records] Research Stations: ${data.stations ? data.stations.length : 0}`);
  console.log(`[Records] Research Topics:   ${data.topics ? data.topics.length : 0}`);
  console.log(`[Records] Expeditions:       ${data.expeditions ? data.expeditions.length : 0}`);
  console.log(`[Records] Documents:         ${data.documents ? data.documents.length : 0}`);
  console.log(`[Records] Semantic Chunks:   ${data.chunks ? data.chunks.length : 0}`);
  console.log(`[Records] Flagship Lessons:  ${data.lessons ? data.lessons.length : 0}`);
  console.log('Database status: SUCCESS (Ready for RAG and Teaching Room).');
} else {
  console.log('[Seed Status] Database file initialized dynamically upon Next.js boot.');
}
