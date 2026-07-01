export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'text/plain',
];

export const MAX_FILE_SIZE = 5 * 1024 * 1024;

export function validateForm({ name, message, file }) {
  const errors = {};

  const trimmedName = name.trim();
  if (!trimmedName) {
    errors.name = 'Name is required';
  } else if (trimmedName.length < 2 || trimmedName.length > 100) {
    errors.name = 'Name must be between 2 and 100 characters';
  }

  const trimmedMessage = message.trim();
  if (!trimmedMessage) {
    errors.message = 'Message is required';
  } else if (trimmedMessage.length < 10 || trimmedMessage.length > 1000) {
    errors.message = 'Message must be between 10 and 1000 characters';
  }

  if (!file) {
    errors.file = 'File is required';
  } else if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    errors.file = 'File must be PDF, JPEG, PNG, or TXT';
  } else if (file.size > MAX_FILE_SIZE) {
    errors.file = 'File must be 5MB or smaller';
  }

  return errors;
}
