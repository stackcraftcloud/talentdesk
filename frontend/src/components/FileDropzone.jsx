import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';

function FileDropzone({ file, onFileSelect, error }) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
      onFileSelect(droppedFile);
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  const zoneClassName = [
    'dropzone',
    isDragging ? 'dropzone--dragging' : '',
    error ? 'dropzone--error' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="form-field">
      <label htmlFor="file" className="form-label">
        Attachment
      </label>
      <div
        className={zoneClassName}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Upload file by clicking or dragging and dropping"
      >
        <input
          ref={inputRef}
          type="file"
          id="file"
          name="file"
          className="dropzone__input"
          accept=".pdf,.jpg,.jpeg,.png,.txt"
          onChange={handleFileChange}
        />
        {file ? (
          <p className="dropzone__filename">{file.name}</p>
        ) : (
          <>
            <p className="dropzone__title">Drag and drop a file here</p>
            <p className="dropzone__hint">or click to browse (PDF, JPEG, PNG, TXT — max 5MB)</p>
          </>
        )}
      </div>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

FileDropzone.propTypes = {
  file: PropTypes.instanceOf(File),
  onFileSelect: PropTypes.func.isRequired,
  error: PropTypes.string,
};

FileDropzone.defaultProps = {
  file: null,
  error: null,
};

export default FileDropzone;
