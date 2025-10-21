import React from 'react';
import { CssBaseline, Container, Button, Stack } from '@mui/material';
import Upload from './components/Upload';
import ItemList from './components/ItemList';
import { useTranslation } from 'react-i18next';

function App() {
  const { t, i18n } = useTranslation();

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
      <div>
        <Upload />
      </div>
      <CssBaseline />
      <Container>
        <ItemList />
      </Container>
    </React.Fragment>
  );
}

export default App;
