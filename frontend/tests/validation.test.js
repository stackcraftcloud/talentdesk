import { describe, expect, it } from 'vitest';
import { validateForm } from '../src/validation.js';

describe('validateForm', () => {
  it('returns no errors for valid input', () => {
    const file = new File(['content'], 'doc.pdf', { type: 'application/pdf' });
    const errors = validateForm({
      name: 'Jane Doe',
      message: 'This is a valid message.',
      file,
    });
    expect(errors).toEqual({});
  });

  it('returns errors for invalid input', () => {
    const errors = validateForm({ name: 'A', message: 'short', file: null });
    expect(errors.name).toBeDefined();
    expect(errors.message).toBeDefined();
    expect(errors.file).toBeDefined();
  });
});
