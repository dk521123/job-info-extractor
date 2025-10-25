import React, { useState } from 'react';
import {
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Box,
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import Upload from './components/Upload';
import ItemList from './components/ItemList';
import { useTranslation } from 'react-i18next';

function App() {
  const { t, i18n } = useTranslation();
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [lang, setLang] = useState<'en' | 'ja'>(i18n.language === 'ja' ? 'ja' : 'en');

  const handleUploadSuccess = () => {
    setReloadTrigger((prev) => prev + 1);
  };

  const handleChangeLanguage = (
    event: React.MouseEvent<HTMLElement>,
    newLang: 'en' | 'ja' | null
  ) => {
    if (newLang !== null) {
      setLang(newLang);
      i18n.changeLanguage(newLang);
    }
  };

  return (
    <React.Fragment>
      <CssBaseline />

      {/* ===== Header ===== */}
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Job Info Extractor
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center">
            <LanguageIcon color="action" />
            <ToggleButtonGroup
              value={lang}
              exclusive
              onChange={handleChangeLanguage}
              aria-label="language toggle"
              size="small"
              color="primary"
            >
              <ToggleButton value="en">🅰️ {t('english')}</ToggleButton>
              <ToggleButton value="ja">あ {t('japanese')}</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* ===== Main Content ===== */}
      <Container sx={{ my: 4 }}>
        <Upload onUploadComplete={handleUploadSuccess} />
        <Box mt={4}>
        <ItemList
          reloadTrigger={reloadTrigger}
          onUploadComplete={() => console.log('Upload complete')}
        />
        </Box>
      </Container>

      {/* ===== Footer ===== */}
      <Box
        component="footer"
        sx={{
          py: 2,
          textAlign: 'center',
          borderTop: '1px solid #ddd',
          color: 'text.secondary',
          fontSize: 14,
        }}
      >
        © {new Date().getFullYear()} Job Info Extractor
      </Box>
    </React.Fragment>
  );
}

export default App;
