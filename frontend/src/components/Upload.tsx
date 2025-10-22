import React, { useRef, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Input,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import { useTranslation } from 'react-i18next';

type ResponseResult = {
  status: string;
  message?: string;
  filename?: string;
  file_type?: string;
};

export const Upload: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [result, setResult] = useState<ResponseResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const uploadFile = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      alert('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('upload_file', file);

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/upload/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const result: ResponseResult = await response.json();
      setResult(result);
    } catch (err: any) {
      console.error('Upload failed:', err);
      setError('Upload failed. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('uploadTitle')}
      </Typography>

      <Input
        type="file"
        inputRef={fileInputRef}
        sx={{ mb: 2 }}
      />

      <Box>
        <Button
          variant="contained"
          color="primary"
          onClick={uploadFile}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : t('upload')}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {result && (
        <Paper elevation={3} sx={{ mt: 4, p: 2, whiteSpace: 'pre-wrap' }}>
          <Typography variant="h6">{t('result')}:</Typography>
          <Typography variant="body1">
            {result.status}
          </Typography>
          {result.message && (
            <Typography variant="body2" color="text.secondary">
              Message: {result.message}
            </Typography>
          )}
          {result.filename !== undefined && (
            <Typography variant="body2" color="text.secondary">
              Filename: {result.filename}
            </Typography>
          )}
          {result.file_type !== undefined && (
            <Typography variant="body2" color="text.secondary">
              File Type: {result.file_type}
            </Typography>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default Upload;
