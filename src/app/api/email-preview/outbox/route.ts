import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const outboxDir = path.join(process.cwd(), 'scratch', 'sent-emails');

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('file');

    if (!fs.existsSync(outboxDir)) {
      return new Response(JSON.stringify({ emails: [] }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (filename) {
      // Return a single file's content
      // Prevent directory traversal attacks by taking the basename
      const safeFilename = path.basename(filename);
      const filePath = path.join(outboxDir, safeFilename);

      if (!fs.existsSync(filePath)) {
        return new Response('File not found', { status: 404 });
      }

      const htmlContent = await fs.promises.readFile(filePath, 'utf8');
      
      return new Response(htmlContent, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'X-Content-Type-Options': 'nosniff',
        },
      });
    }

    // List all files and parse their metadata
    const files = await fs.promises.readdir(outboxDir);
    const emails = [];

    for (const file of files) {
      if (file.endsWith('.html')) {
        const filePath = path.join(outboxDir, file);
        const content = await fs.promises.readFile(filePath, 'utf8');
        
        // Parse metadata comment from the top: <!-- METADATA: {...} -->
        const metadataMatch = content.match(/<!-- METADATA: (\{.*?\}) -->/);
        let metadata = {
          to: 'unknown@upm.edu.my',
          subject: 'No Subject',
          template: 'UNKNOWN',
          timestamp: new Date().toISOString(),
        };

        if (metadataMatch && metadataMatch[1]) {
          try {
            metadata = JSON.parse(metadataMatch[1]);
          } catch (e) {
            console.error('Failed to parse metadata in file', file, e);
          }
        }

        emails.push({
          filename: file,
          ...metadata,
        });
      }
    }

    // Sort emails by timestamp descending
    emails.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return new Response(JSON.stringify({ emails }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error fetching outbox:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (fs.existsSync(outboxDir)) {
      const files = await fs.promises.readdir(outboxDir);
      for (const file of files) {
        if (file.endsWith('.html')) {
          await fs.promises.unlink(path.join(outboxDir, file));
        }
      }
    }
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error clearing outbox:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
