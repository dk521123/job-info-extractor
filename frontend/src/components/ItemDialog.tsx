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
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";
import { useTranslation } from "react-i18next";
import type { UpdatedJobInfo } from "../types/JobInfo";

type Props = {
  isForNew: boolean;
  openDialog: boolean;
  onClose: () => void;
  targetJobInfo?: UpdatedJobInfo;
  onSave: (updatedJobInfo: UpdatedJobInfo) => void;
};

export const ItemDialog: React.FC<Props> = ({
  isForNew,
  openDialog,
  onClose,
  targetJobInfo,
  onSave,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<UpdatedJobInfo | undefined>(targetJobInfo);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const EMPTY_JOB_INFO: UpdatedJobInfo = {
    id: undefined,
    company_name: "",
    position: "",
    location: "",
    salary: "",
    file_type: undefined,
    file_name: undefined,
    created_at: undefined,
    updated_at: undefined,
    updateType: "new",
  };

  useEffect(() => {
    setFormData(targetJobInfo ?? EMPTY_JOB_INFO);
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

    const handleAdd = async () => {
    if (!formData) return;
    if (!validate()) return;

    setSaving(true);
    setErrorMessage(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/add/`,
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

      formData.updateType = "new";
      onSave(formData);
    } catch (err: any) {
      console.error("Failed to add job info:", err);
      const message = t("saveFailed") + ": " + (err.message ?? "Unknown error");
      setErrorMessage(message);
      setShowSnackbar(true);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async () => {
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

      formData.updateType = "update";
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

  const handleDelete = async () => {
    if (!formData) return;

    setSaving(true);
    setErrorMessage(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/delete/${formData.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `HTTP ${response.status}`);
      }

      formData.updateType = "delete";
      onSave(formData);
    } catch (err: any) {
      console.error("Failed to delete job info:", err);
      const message = t("deleteFailed") + ": " + (err.message ?? "Unknown error");
      setErrorMessage(message);
      setShowSnackbar(true);
    } finally {
      setSaving(false);
    }
  };

  const systemFields = [
    { label: t("fileType"), name: "file_type" },
    { label: t("fileName"), name: "file_name" },
    { label: t("createdAt"), name: "created_at" },
    { label: t("updatedAt"), name: "updated_at" },
  ];

  return (
    <>
      <Dialog open={openDialog} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ color: errorMessage ? "error.main" : "inherit" }}>
          {isForNew ? (t("addJobInfo")) : (t("editJobInfo"))} {formData !== null && !isForNew && ` - ${t("id")}: ${formData?.id}`}
        </DialogTitle>

        <DialogContent sx={{ mt: 1 }}>
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}
          <div style={{ padding: 10 }}>
            <Grid container spacing={2}>
              {[
                { label: t("companyName"), name: "company_name" },
                { label: t("position"), name: "position" },
                { label: t("location"), name: "location" },
                { label: t("salary"), name: "salary" },
              ].map((field) => (
                <Grid item xs={12} sm={6} key={field.name}>
                  <TextField
                    sx={{ minWidth: 250 }}
                    label={field.label}
                    name={field.name}
                    value={formData?.[field.name as keyof UpdatedJobInfo] ?? ""}
                    onChange={handleChange}
                    error={!!fieldErrors[field.name]}
                    helperText={fieldErrors[field.name]}
                  />
                </Grid>
              ))}
            </Grid>

            {!isForNew && (
              <React.Fragment>
                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {t("systemInfo")}
                </Typography>

                <Grid container spacing={2}>
                  {systemFields.map((field) => (
                    <Grid item xs={12} sm={6} key={field.name}>
                      <TextField
                        sx={{ minWidth: 250 }}
                        label={field.label}
                        value={formData?.[field.name as keyof UpdatedJobInfo] ?? ""}
                        InputProps={{ readOnly: true }}
                        variant="filled"
                      />
                    </Grid>
                  ))}
                </Grid>
              </React.Fragment>
            )}
          </div>
        </DialogContent>

        <DialogActions>
        {isForNew ? (
          <Button
            onClick={handleAdd}
            variant="contained"
            disabled={saving}
            startIcon={saving ? <CircularProgress size={18} /> : <SaveIcon />}
          >
            {t("save")}
          </Button>
        ) : (
          <React.Fragment>
            <Button
              onClick={handleUpdate}
              variant="contained"
              disabled={saving}
              startIcon={saving ? <CircularProgress size={18} /> : <SaveIcon />}
            >
              {t("save")}
            </Button>
            <Button
              onClick={handleDelete}
              variant="outlined"
              disabled={saving}
              startIcon={saving ? <CircularProgress size={18} /> : <DeleteIcon />}
            >
              {t("delete")}
            </Button>
          </React.Fragment>
        )}
          <Button onClick={onClose} disabled={saving} startIcon={<CancelIcon />}>
            {t("cancel")}
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

export default ItemDialog;
