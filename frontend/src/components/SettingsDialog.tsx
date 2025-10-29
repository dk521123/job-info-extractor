import React, { useState, useEffect, useCallback } from "react";
import {
  Typography,
  Box,
  Modal,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { SettingsManager } from '../SettingsManager';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

type SettingsDialogProps = {
  openSettingsDialog: boolean;
  onCloseSettingDialog: () => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({
  openSettingsDialog,
  onCloseSettingDialog,
}) => {
  const { t } = useTranslation();

  // For settings
  const [rowLimit, setRowLimit] = useState<string>(
    SettingsManager.getRowLimit().toString()
  );

  // To load settings
  useEffect(() => {
    if (openSettingsDialog) {
      setRowLimit(SettingsManager.getRowLimit().toString());
    }
  }, [openSettingsDialog]);

  // To save settings after user actions
  const handleRowLimitChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setRowLimit(newValue);    
    SettingsManager.setRowLimit(Number(newValue));
  }, []);

  return (
    <div>
      <Modal
        open={openSettingsDialog}
        onClose={onCloseSettingDialog}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {t('settings')}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <FormControl>
              <FormLabel id="search-row-limit-label">{t('rowLimit')}</FormLabel>
              <RadioGroup
                row
                aria-labelledby="search-row-limit-label"
                name="search-row-limit"
                value={rowLimit}
                onChange={handleRowLimitChange}
              >
                <FormControlLabel value="10" control={<Radio />} label="10" />
                <FormControlLabel value="20" control={<Radio />} label="20" />
                <FormControlLabel value="50" control={<Radio />} label="50" />
              </RadioGroup>
            </FormControl>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}

export default SettingsDialog;
