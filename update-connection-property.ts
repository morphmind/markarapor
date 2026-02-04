/**
 * Script to update propertyId for existing connections
 *
 * Usage:
 *   pnpm exec tsx update-connection-property.ts <connectionId> <propertyId>
 *
 * Examples:
 *   # For Google Analytics (GA4 Property ID):
 *   pnpm exec tsx update-connection-property.ts cml75m04r000b1wvsyr2kvyjy 123456789
 *
 *   # For Search Console (Site URL):
 *   pnpm exec tsx update-connection-property.ts cml75lpad00071wvsviemzyvn "https://kirmanpremium.com"
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    // List all connections with their current propertyIds
    console.log('=== CURRENT CONNECTIONS ===\n');

    const connections = await prisma.connection.findMany({
      include: {
        brandConnections: true
      }
    });

    for (const conn of connections) {
      console.log(`Connection: ${conn.name}`);
      console.log(`  ID: ${conn.id}`);
      console.log(`  Provider: ${conn.provider}`);
      console.log(`  Status: ${conn.status}`);

      for (const bc of conn.brandConnections) {
        console.log(`  Brand Connection ID: ${bc.id}`);
        console.log(`  PropertyId: ${bc.propertyId || 'NOT SET!'}`);
      }
      console.log('---');
    }

    console.log('\n=== USAGE ===');
    console.log('To update a connection, run:');
    console.log('  pnpm exec tsx update-connection-property.ts <connectionId> <propertyId>');
    console.log('\nFor GA4: Use your GA4 Property ID (e.g., 123456789)');
    console.log('For Search Console: Use your site URL (e.g., https://example.com)');

    await prisma.$disconnect();
    return;
  }

  const [connectionId, propertyId] = args;

  // Find brand connections for this connection
  const brandConnections = await prisma.brandConnection.findMany({
    where: { connectionId },
    include: { connection: true }
  });

  if (brandConnections.length === 0) {
    console.error(`No brand connections found for connection ID: ${connectionId}`);
    await prisma.$disconnect();
    process.exit(1);
  }

  // Update all brand connections with this connectionId
  for (const bc of brandConnections) {
    console.log(`Updating brand connection ${bc.id}...`);
    console.log(`  Provider: ${bc.connection.provider}`);
    console.log(`  Old propertyId: ${bc.propertyId || 'null'}`);
    console.log(`  New propertyId: ${propertyId}`);

    await prisma.brandConnection.update({
      where: { id: bc.id },
      data: {
        propertyId: propertyId,
        propertyName: propertyId,
      }
    });

    console.log('  Done!');
  }

  console.log('\n✅ Connection updated successfully!');
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
