import { neon, neonConfig } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) throw Error('database url does not exist')

neonConfig.fetchConnectionCache = true

const sql = neon(DATABASE_URL)
const db = drizzle(sql)

