'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const postgres_js_1 = require('drizzle-orm/postgres-js');
const schema_1 = require('./shared/schema');
const postgres_1 = require('postgres');
const connectionString = process.env.DATABASE_URL;
const client = (0, postgres_1.default)(connectionString);
const db = (0, postgres_js_1.drizzle)(client);
async function main() {
  await db.update(schema_1.users).set({ persona: {} });
  console.log('Seeding complete.');
  process.exit(0);
}
main().catch(err => {
  console.error(err);
  process.exit(1);
});
