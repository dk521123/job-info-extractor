import React from 'react';
import { CssBaseline, Container } from '@mui/material';
import Upload from './Upload';
import ItemList from './ItemList';

function App() {
  return (
    <React.Fragment>
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
