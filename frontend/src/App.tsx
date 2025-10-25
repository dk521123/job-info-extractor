import React, { useState } from 'react';
import {
  CssBaseline,
  Container,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import Upload from './components/Upload';
import ItemList from './components/ItemList';
import { useTranslation } from 'react-i18next';
import LanguageIcon from '@mui/icons-material/Language';

function App() {
  const { t, i18n } = useTranslation();
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [lang, setLang] = useState<'en' | 'ja'>(i18n.language === 'ja' ? 'ja' : 'en');

  const handleUploadSuccess = () => {
    setReloadTrigger((prev) => prev + 1);
  };

  const handleChangeLanguage = (
    _: React.MouseEvent<HTMLElement>,
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
      <div style={{ padding: 20 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2 }}>
          <LanguageIcon color="action" />
          <ToggleButtonGroup
            value={lang}
            exclusive
            onChange={handleChangeLanguage}
            aria-label="language toggle"
            size="small"
            color="primary"
          >
            <ToggleButton value="en" aria-label="english">
              🅰️ {t('english')}
            </ToggleButton>
            <ToggleButton value="ja" aria-label="japanese">
              あ {t('japanese')}
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </div>

      <Container>
        <Upload onUploadComplete={handleUploadSuccess} />
        <ItemList
          reloadTrigger={reloadTrigger}
          onUploadComplete={() => console.log('Upload complete')}
        />
      </Container>
    </React.Fragment>
  );
}

export default App;
