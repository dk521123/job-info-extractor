import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Grid,
  Divider,
  Typography,
  Snackbar,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import type { JobInfo } from "../types/JobInfo";

type Props = {
  openDialog: boolean;
  onClose: () => void;
  targetJobInfo?: JobInfo;
  onSave: (updatedJobInfo: JobInfo) => void;
};

export const ItemDialog: React.FC<Props> = ({
  openDialog,
  onClose,
  targetJobInfo,
  onSave,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<JobInfo | undefined>(targetJobInfo);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    setFormData(targetJobInfo);
    setErrorMessage(null);
    setFieldErrors({});
    setShowSnackbar(false);
  }, [openDialog, targetJobInfo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : undefined));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    setErrorMessage(null);
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData?.company_name) errors.company_name = t("requiredField");
    if (!formData?.position) errors.position = t("requiredField");
    if (!formData?.salary) errors.salary = t("requiredField");
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!formData) return;
    if (!validate()) return;

    setSaving(true);
    setErrorMessage(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/update/${formData.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `HTTP ${response.status}`);
      }

      onSave(formData);
    } catch (err: any) {
      console.error("Failed to save job info:", err);
      const message = t("saveFailed") + ": " + (err.message ?? "Unknown error");
      setErrorMessage(message);
      setShowSnackbar(true);
    } finally {
      setSaving(false);
    }
  };

  const systemFields = [
    { label: t("id"), name: "id" },
    { label: t("fileType"), name: "file_type" },
    { label: t("fileName"), name: "file_name" },
    { label: t("createdAt"), name: "created_at" },
    { label: t("updatedAt"), name: "updated_at" },
  ];

  return (
    <>
      <Dialog open={openDialog} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ color: errorMessage ? "error.main" : "inherit" }}>
          {t("editJobInfo")}
        </DialogTitle>

        <DialogContent sx={{ mt: 1 }}>
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}

          <Grid container spacing={2}>
            {[
              { label: t("companyName"), name: "company_name" },
              { label: t("position"), name: "position" },
              { label: t("location"), name: "location" },
              { label: t("salary"), name: "salary" },
            ].map((field) => (
              <Grid item xs={12} sm={6} key={field.name}>
                <TextField
                  fullWidth
                  label={field.label}
                  name={field.name}
                  value={formData?.[field.name as keyof JobInfo] ?? ""}
                  onChange={handleChange}
                  error={!!fieldErrors[field.name]}
                  helperText={fieldErrors[field.name]}
                />
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            {t("systemInfo")}
          </Typography>

          <Grid container spacing={2}>
            {systemFields.map((field) => (
              <Grid item xs={12} sm={6} key={field.name}>
                <TextField
                  fullWidth
                  label={field.label}
                  value={formData?.[field.name as keyof JobInfo] ?? ""}
                  InputProps={{ readOnly: true }}
                  variant="filled"
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={saving}>
            {t("cancel")}
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={saving}
            startIcon={saving ? <CircularProgress size={18} /> : null}
          >
            {t("save")}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={4000}
        onClose={() => setShowSnackbar(false)}
        message={errorMessage}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />
    </>
  );
};
