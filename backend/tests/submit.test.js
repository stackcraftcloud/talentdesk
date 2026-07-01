/** @vitest-environment node */

import fs from 'fs';
import os from 'os';
import path from 'path';
import {
  afterEach, beforeEach, describe, expect, it,
} from 'vitest';
import request from 'supertest';
import { createApp, uploadDir } from '../src/app.js';

describe('POST /api/submit', () => {
  let app;

  beforeEach(() => {
    app = createApp();
  });

  afterEach(() => {
    if (fs.existsSync(uploadDir)) {
      fs.readdirSync(uploadDir).forEach((file) => {
        fs.unlinkSync(path.join(uploadDir, file));
      });
    }
  });

  it('returns submitted data with file path on valid submission', async () => {
    const tmpFile = path.join(os.tmpdir(), 'test-upload.txt');
    fs.writeFileSync(tmpFile, 'hello world');

    const response = await request(app)
      .post('/api/submit')
      .field('name', 'Jane Doe')
      .field('message', 'This is a valid test message.')
      .attach('file', tmpFile);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Jane Doe');
    expect(response.body.message).toBe('This is a valid test message.');
    expect(response.body.filePath).toContain('uploads');
    expect(fs.existsSync(response.body.filePath)).toBe(true);

    fs.unlinkSync(tmpFile);
  });

  it('returns validation errors for missing fields', async () => {
    const response = await request(app)
      .post('/api/submit')
      .field('name', '')
      .field('message', 'short');

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'name' }),
        expect.objectContaining({ field: 'message' }),
        expect.objectContaining({ field: 'file' }),
      ]),
    );
  });

  it('rejects files that exceed the size limit', async () => {
    const tmpFile = path.join(os.tmpdir(), 'large-file.txt');
    fs.writeFileSync(tmpFile, 'x'.repeat(6 * 1024 * 1024));

    const response = await request(app)
      .post('/api/submit')
      .field('name', 'Jane Doe')
      .field('message', 'This is a valid test message.')
      .attach('file', tmpFile);

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'file', message: 'File must be 5MB or smaller' }),
      ]),
    );

    fs.unlinkSync(tmpFile);
  });
});
