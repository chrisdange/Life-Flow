import { PrismaClient } from '@prisma/client'

const connections = [
  {
    name: "Direct Connection",
    url: "postgresql://postgres:tSql8RmG95uakuOj@db.ocuddmoanmoeggzvbajr.supabase.co:5432/postgres"
  },
  {
    name: "Pooled Connection",
    url: "postgresql://postgres.ocuddmoanmoeggzvbajr:tSql8RmG95uakuOj@aws-0-eu-north-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
  },
  {
    name: "Pooled Connection (no pgbouncer)",
    url: "postgresql://postgres.ocuddmoanmoeggzvbajr:tSql8RmG95uakuOj@aws-0-eu-north-1.pooler.supabase.com:6543/postgres"
  },
  {
    name: "Pooled Connection (port 5432)",
    url: "postgresql://postgres.ocuddmoanmoeggzvbajr:tSql8RmG95uakuOj@aws-0-eu-north-1.pooler.supabase.com:5432/postgres"
  }
]

async function testConnection(name, url) {
  console.log(`\n🔍 Testing ${name}...`)
  console.log(`URL: ${url}`)
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: url
      }
    }
  })
  
  try {
    await prisma.$connect()
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log(`✅ ${name} - SUCCESS`)
    await prisma.$disconnect()
    return true
  } catch (error) {
    console.log(`❌ ${name} - FAILED: ${error.message}`)
    await prisma.$disconnect()
    return false
  }
}

async function testAllConnections() {
  console.log('🚀 Testing all connection strings...\n')
  
  for (const conn of connections) {
    const success = await testConnection(conn.name, conn.url)
    if (success) {
      console.log(`\n🎉 Found working connection: ${conn.name}`)
      console.log(`Use this URL: ${conn.url}`)
      break
    }
  }
}

testAllConnections()
