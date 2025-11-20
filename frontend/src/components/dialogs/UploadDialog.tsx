import React, { useRef, useState } from 'react';
import {
  Box,
  Button,
  Input,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CancelIcon from "@mui/icons-material/Cancel";
import UploadFile from '@mui/icons-material/UploadFile';
import { useTranslation } from 'react-i18next';
import type { RegisterResponse } from '../../types/RegisterResponse';

type UploadProps = {
  openDialog: boolean;
  onClose: () => void;
  onUploadComplete: () => void;
};

export const UploadDialog: React.FC<UploadProps> = ({ openDialog, onClose, onUploadComplete }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'info' });

  const { t } = useTranslation();

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const uploadFile = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setSnackbar({
        open: true,
        message: 'Please select a file first.',
        severity: 'error',
      });
      return;
    }

    const formData = new FormData();
    formData.append('upload_file', file);

    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/upload/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const result: RegisterResponse = await response.json();
      console.log('Upload result:', result);

      // Notify parent component
      onUploadComplete();

      // After upload, clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Upload failed:', err);
      // Set failed Snackbar
      setSnackbar({
        open: true,
        message: 'Upload failed. Please check the console.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
      <Dialog open={openDialog} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 600 }}>
          {t('uploadTitle')}
        </DialogTitle>

        <DialogContent sx={{ mt: 1 }}></DialogContent>
        <DialogActions sx={{ flexDirection: 'column', alignItems: 'stretch', gap: 2, mb: 2 }}>
          <Input type="file" inputRef={fileInputRef} sx={{ mb: 2 }} />
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={uploadFile}
              disabled={loading}
              startIcon={<UploadFile />}
              sx={{ mr: 1 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : t('upload')}
            </Button>
            <Button onClick={onClose} startIcon={<CancelIcon />}>
              {t("cancel")}
            </Button>
          </Box>

          {/* Snackbar */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={4000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert
              onClose={handleSnackbarClose}
              severity={snackbar.severity}
              sx={{ width: '100%' }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </DialogActions>
      </Dialog>
  );
};

export default UploadDialog;
