import React, { useState } from 'react';
import FileDropzone from './components/FileDropzone';
import { validateForm } from './validation';
import './App.css';

function App() {
  const [formData, setFormData] = useState({ name: '', message: '' });
  const [file, setFile] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setFieldErrors((prev) => ({ ...prev, file: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setResponse(null);

    const errors = validateForm({ ...formData, file });
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const body = new FormData();
      body.append('name', formData.name.trim());
      body.append('message', formData.message.trim());
      body.append('file', file);

      const res = await fetch('/api/submit', {
        method: 'POST',
        body,
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          const serverErrors = {};
          data.errors.forEach(({ field, message }) => {
            serverErrors[field] = message;
          });
          setFieldErrors(serverErrors);
        } else {
          setError('Submission failed. Please try again.');
        }
        return;
      }

      setResponse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app">
      <h1 className="app__title">Form Submission</h1>
      <p className="app__subtitle">Fill in the details below and attach a file.</p>

      <form className="form-card" onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className={`form-input${fieldErrors.name ? ' form-input--error' : ''}`}
            value={formData.name}
            onChange={handleChange}
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? 'name-error' : undefined}
          />
          {fieldErrors.name && (
            <p id="name-error" className="field-error">{fieldErrors.name}</p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="message" className="form-label">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            className={`form-input${fieldErrors.message ? ' form-input--error' : ''}`}
            value={formData.message}
            onChange={handleChange}
            rows={4}
            aria-invalid={Boolean(fieldErrors.message)}
            aria-describedby={fieldErrors.message ? 'message-error' : undefined}
          />
          {fieldErrors.message && (
            <p id="message-error" className="field-error">{fieldErrors.message}</p>
          )}
        </div>

        <FileDropzone
          file={file}
          onFileSelect={handleFileSelect}
          error={fieldErrors.file}
        />

        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting…' : 'Submit'}
        </button>
      </form>

      {error && <p className="alert alert--error">{error}</p>}

      {response && (
        <div className="response-card">
          <h2 className="response-card__title">Response</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
