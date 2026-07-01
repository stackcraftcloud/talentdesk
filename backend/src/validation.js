import { body } from 'express-validator';

export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'text/plain',
];

export const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const submitValidators = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .bail()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .bail()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters'),
];

export function formatValidationErrors(errors) {
  return errors.array().map((error) => ({
    field: error.path,
    message: error.msg,
  }));
}
