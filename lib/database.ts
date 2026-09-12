import mysql, { type Pool, type RowDataPacket } from 'mysql2/promise';

// One small connection pool per Node process; settings live outside deployment files.
const shared = globalThis as typeof globalThis & { diaryPool?: Pool; diarySchema?: Promise<void> };
function pool() {
  if (!shared.diaryPool) {
    for (const key of ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME']) {
      if (!process.env[key]) throw new Error(`Missing ${key}`);
    }
    shared.diaryPool = mysql.createPool({
      socketPath: process.env.DB_SOCKET || undefined,
      host: process.env.DB_HOST, port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_NAME,
      connectionLimit: 3, waitForConnections: true, queueLimit: 20,
      connectTimeout: 10000, charset: 'utf8mb4',
    });
  }
  return shared.diaryPool;
}
async function initialize() {
  const connection = pool();
  await connection.execute(`CREATE TABLE IF NOT EXISTS diary_settings (
    id TINYINT UNSIGNED PRIMARY KEY, drive TEXT NOT NULL, unlocked TINYINT NOT NULL DEFAULT 0
  ) ENGINE=InnoDB`);
  await connection.execute(`CREATE TABLE IF NOT EXISTS diary_sessions (
    token CHAR(64) PRIMARY KEY, role VARCHAR(8) NOT NULL, expires BIGINT NOT NULL,
    INDEX diary_sessions_expiry (expires)
  ) ENGINE=InnoDB`);
  await connection.execute(`CREATE TABLE IF NOT EXISTS diary_attempts (
    bucket VARCHAR(8) PRIMARY KEY, attempts INT NOT NULL, expires BIGINT NOT NULL
  ) ENGINE=InnoDB`);
  // This never overwrites saved settings on restart or redeploy.
  await connection.execute('INSERT IGNORE INTO diary_settings (id,drive,unlocked) VALUES (1,?,0)', [process.env.DRIVE_URL || '']);
}
export async function database() {
  if (!shared.diarySchema) shared.diarySchema = initialize().catch(error => { shared.diarySchema = undefined; throw error; });
  await shared.diarySchema;
  return pool();
}
export async function rows<T>(sql: string, params: (string | number)[] = []): Promise<T[]> {
  const [result] = await (await database()).execute<RowDataPacket[]>(sql, params);
  return result as T[];
}
export async function execute(sql: string, params: (string | number)[] = []) {
  await (await database()).execute(sql, params);
}
