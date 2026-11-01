/**
 * KOMPAS - Full-Stack Express Server with Persistent Database
 * Handles /api/inventory REST endpoints and mounts Vite dev middlewares.
 */

import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';

// Parse CLI arguments (e.g. --port 3000) passed by npm run dev
const args = process.argv.slice(2);
const portArgIdx = args.indexOf('--port');
const cliPort = portArgIdx !== -1 && args[portArgIdx + 1] ? parseInt(args[portArgIdx + 1], 10) : null;
// In development, dev server must run on port 3000 (ignoring container PORT env var which is 8080)
const PORT = cliPort || (process.env.NODE_ENV === 'production' && process.env.PORT ? parseInt(process.env.PORT, 10) : 3000);
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'kompas_db.json');

interface DatabaseSchema {
  metadata_records: any[];
  metadata_versions: any[];
  audit_runs: any[];
}

function initDatabase(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (parsed && Array.isArray(parsed.metadata_records)) {
        return parsed;
      }
    } catch (err) {
      console.warn('Gagal membaca basis data, membuat file baru:', err);
    }
  }

  const initialDb: DatabaseSchema = {
    metadata_records: [],
    metadata_versions: [],
    audit_runs: [],
  };

  fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
  return initialDb;
}

function saveDatabase(db: DatabaseSchema) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Gagal menyimpan basis data persisten:', err);
  }
}

async function startServer() {
  const app = express();
  let db = initDatabase();

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // API Route: Get all metadata records
  app.get('/api/inventory', (req: Request, res: Response) => {
    db = initDatabase();
    let records = [...db.metadata_records];

    const { search, format, status } = req.query;

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      records = records.filter(
        (r) =>
          r.title?.toLowerCase().includes(q) ||
          r.sourceFileName?.toLowerCase().includes(q) ||
          r.inventoryNumber?.toLowerCase().includes(q)
      );
    }

    if (format && typeof format === 'string' && format !== 'all') {
      records = records.filter((r) => r.fileFormat?.toLowerCase().includes(format.toLowerCase()));
    }

    if (status && typeof status === 'string' && status !== 'all') {
      records = records.filter((r) => r.latestAuditStatus === status);
    }

    records.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
    res.json({ success: true, count: records.length, records });
  });

  // API Route: Get stats
  app.get('/api/stats', (_req: Request, res: Response) => {
    db = initDatabase();
    const totalMetadata = db.metadata_records.length;
    const totalAudits = db.audit_runs.length;
    const completedAudits = db.audit_runs.filter((r) => r.completionStatus === 'completed').length;
    const failedAudits = db.audit_runs.filter((r) => r.completionStatus === 'failed').length;

    const scored = db.metadata_records.filter((r) => r.latestMqiScore !== null && r.latestMqiScore !== undefined);
    const avgMqi = scored.length > 0
      ? Math.round((scored.reduce((acc, r) => acc + (r.latestMqiScore || 0), 0) / scored.length) * 10) / 10
      : 0;

    let totalFindings = 0;
    let compliantCount = 0;
    let needsReviewCount = 0;
    let unfulfilledCount = 0;

    db.metadata_records.forEach((r) => {
      if (r.latestAuditStatus === 'Lolos Penuh') compliantCount++;
      if (r.latestAuditStatus === 'Lolos Bersyarat') needsReviewCount++;
      if (r.latestAuditStatus === 'Perlu Perbaikan') unfulfilledCount++;
      if (r.latestStatusCounts) {
        totalFindings += (r.latestStatusCounts.tidak_terpenuhi || 0) + (r.latestStatusCounts.tidak_valid || 0);
      }
    });

    res.json({
      success: true,
      stats: {
        totalMetadata,
        totalAudits,
        completedAudits,
        failedAudits,
        avgMqi,
        totalFindings,
        compliantCount,
        needsReviewCount,
        unfulfilledCount,
      },
    });
  });

  // API Route: Get single record with versions & runs
  app.get('/api/inventory/:id', (req: Request, res: Response) => {
    db = initDatabase();
    const record = db.metadata_records.find((r) => r.id === req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Metadata tidak ditemukan' });
    }
    const versions = db.metadata_versions.filter((v) => v.metadataRecordId === record.id);
    const runs = db.audit_runs
      .filter((r) => r.metadataRecordId === record.id)
      .sort((a, b) => new Date(b.runTimestamp).getTime() - new Date(a.runTimestamp).getTime());

    res.json({ success: true, record, versions, runs });
  });

  // API Route: Get history runs for a record
  app.get('/api/inventory/:id/history', (req: Request, res: Response) => {
    db = initDatabase();
    const runs = db.audit_runs
      .filter((r) => r.metadataRecordId === req.params.id)
      .sort((a, b) => new Date(b.runTimestamp).getTime() - new Date(a.runTimestamp).getTime());
    res.json({ success: true, runs });
  });

  // API Route: Save or update metadata records (batch or single)
  app.post('/api/inventory/upload', (req: Request, res: Response) => {
    db = initDatabase();
    const { record, version } = req.body;
    if (!record || !record.id) {
      return res.status(400).json({ success: false, message: 'Data record tidak lengkap' });
    }

    const existingIdx = db.metadata_records.findIndex((r) => r.id === record.id);
    if (existingIdx >= 0) {
      db.metadata_records[existingIdx] = record;
    } else {
      db.metadata_records.push(record);
    }

    if (version) {
      const vIdx = db.metadata_versions.findIndex((v) => v.id === version.id);
      if (vIdx >= 0) {
        db.metadata_versions[vIdx] = version;
      } else {
        db.metadata_versions.push(version);
      }
    }

    saveDatabase(db);
    res.json({ success: true, record });
  });

  // API Route: Save an audit run
  app.post('/api/inventory/audit-run', (req: Request, res: Response) => {
    db = initDatabase();
    const { run, updatedRecord } = req.body;
    if (!run || !run.id) {
      return res.status(400).json({ success: false, message: 'Data audit run tidak lengkap' });
    }

    // Append new run (immutable history)
    const existingRunIdx = db.audit_runs.findIndex((r) => r.id === run.id);
    if (existingRunIdx >= 0) {
      db.audit_runs[existingRunIdx] = run;
    } else {
      db.audit_runs.push(run);
    }

    // Update parent record
    if (updatedRecord && updatedRecord.id) {
      const rIdx = db.metadata_records.findIndex((r) => r.id === updatedRecord.id);
      if (rIdx >= 0) {
        db.metadata_records[rIdx] = updatedRecord;
      } else {
        db.metadata_records.push(updatedRecord);
      }
    }

    saveDatabase(db);
    res.json({ success: true, run });
  });

  // API Route: Delete record
  app.delete('/api/inventory/:id', (req: Request, res: Response) => {
    db = initDatabase();
    const { id } = req.params;
    db.metadata_records = db.metadata_records.filter((r) => r.id !== id);
    db.metadata_versions = db.metadata_versions.filter((v) => v.metadataRecordId !== id);
    db.audit_runs = db.audit_runs.filter((r) => r.metadataRecordId !== id);
    saveDatabase(db);
    res.json({ success: true, message: 'Record berhasil dihapus' });
  });

  // API Route: Clear all inventory
  app.delete('/api/inventory', (_req: Request, res: Response) => {
    db = {
      metadata_records: [],
      metadata_versions: [],
      audit_runs: [],
    };
    saveDatabase(db);
    res.json({ success: true, message: 'Seluruh inventaris dibersihkan' });
  });

  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`KOMPAS full-stack server running at http://0.0.0.0:${PORT}`);
  });

  server.on('error', (err: any) => {
    console.error('Fatal Server Error:', err);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
