import React from 'react';
import { CssBaseline, Container } from '@mui/material';
import OCRUpload from './OCRUpload';
import ItemList from './ItemList';

function App() {
  return (
    <React.Fragment>
      <div>
        <OCRUpload />
      </div>
      <CssBaseline />
      <Container>
        <ItemList />
      </Container>
    </React.Fragment>
  );
}

export default App;
