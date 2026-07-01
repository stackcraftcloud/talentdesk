import express from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { validationResult } from 'express-validator';
import {
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE,
  formatValidationErrors,
  submitValidators,
} from './validation.js';

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(moduleDir, '../uploads');

function ensureUploadDir() {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
}

function createUploadMiddleware() {
  ensureUploadDir();

  const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (_req, file, cb) => {
      const safeName = file.originalname.replace(/ [^a-zA-Z0-9._-]/g, '_');
      cb(null, `${Date.now()}-${safeName}`);
    },
  });

  return multer({
    storage,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter: (_req, file, cb) => {
      if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        cb(null, true);
        return;
      }
      cb(new Error('Invalid file type. Allowed: PDF, JPEG, PNG, TXT'));
    },
  });
}

export function createApp() {
  const app = express();
  const upload = createUploadMiddleware();

  app.post('/api/submit', upload.single('file'), submitValidators, (req, res) => {
    const errors = validationResult(req);
    const formattedErrors = errors.isEmpty() ? [] : formatValidationErrors(errors);

    if (!req.file) {
      formattedErrors.push({ field: 'file', message: 'File is required' });
    }

    if (formattedErrors.length > 0) {
      return res.status(400).json({ errors: formattedErrors });
    }

    return res.json({
      name: req.body.name,
      message: req.body.message,
      filePath: req.file.path,
    });
  });

  app.use((err, _req, res, next) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          errors: [{ field: 'file', message: 'File must be 5MB or smaller' }],
        });
      }
      return res.status(400).json({
        errors: [{ field: 'file', message: err.message }],
      });
    }

    if (err) {
      return res.status(400).json({
        errors: [{ field: 'file', message: err.message }],
      });
    }

    return next();
  });

  return app;
}

export { uploadDir };
