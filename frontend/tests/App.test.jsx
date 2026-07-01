import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  beforeEach, describe, expect, it, vi,
} from 'vitest';
import App from '../src/App';

describe('App', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('shows validation errors when submitting empty form', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(await screen.findByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Message is required')).toBeInTheDocument();
    expect(screen.getByText('File is required')).toBeInTheDocument();
  });

  it('submits the form and displays the response', async () => {
    const user = userEvent.setup();

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        name: 'Jane Doe',
        message: 'This is a valid test message.',
        filePath: '/uploads/test-file.txt',
      }),
    });

    render(<App />);

    await user.type(screen.getByLabelText('Name'), 'Jane Doe');
    await user.type(screen.getByLabelText('Message'), 'This is a valid test message.');

    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });
    const fileInput = document.getElementById('file');
    await user.upload(fileInput, file);

    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/Response/)).toBeInTheDocument();
    });

    expect(screen.getByText(/test-file.txt/)).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith('/api/submit', expect.objectContaining({
      method: 'POST',
    }));
  });
});
