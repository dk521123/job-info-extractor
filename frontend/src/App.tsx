import React, { useState } from 'react';
import { CssBaseline, Container, Button, Stack } from '@mui/material';
import Upload from './components/Upload';
import ItemList from './components/ItemList';
import { useTranslation } from 'react-i18next';

function App() {
  const { t, i18n } = useTranslation();
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const handleUploadSuccess = () => {
    // Trigger ItemList to reload data
    setReloadTrigger((prev) => prev + 1);
  };

  const handleChangeLanguage = (lang: 'en' | 'ja') => {
    i18n.changeLanguage(lang);
  };

  return (
    <React.Fragment>
      <div style={{ padding: 20 }}>
        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          <Button variant="contained" onClick={() => handleChangeLanguage('en')}>
            {t('english')}
          </Button>
          <Button variant="outlined" onClick={() => handleChangeLanguage('ja')}>
            {t('japanese')}
          </Button>
        </Stack>
      </div>

      <Upload onUploadComplete={handleUploadSuccess} />

      <CssBaseline />
      <Container>
        <ItemList 
          reloadTrigger={reloadTrigger} 
          onUploadComplete={() => {
            console.log('Upload complete');
          }} 
        />
      </Container>
    </React.Fragment>
  );
}

export default App;
