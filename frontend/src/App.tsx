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
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Alert,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LanguageIcon from '@mui/icons-material/Language';
import UploadFile from '@mui/icons-material/UploadFile';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import UploadDialog from './components/UploadDialog';
import ItemDialog from './components/ItemDialog';
import ItemList from './components/ItemList';
import { useTranslation } from 'react-i18next';
import type { UpdatedJobInfo } from './types/JobInfo';

// Width of the drawer in sidebar
const drawerWidth = 240;

function App() {
  const { t, i18n } = useTranslation();
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [lang, setLang] = useState<'en' | 'ja'>(i18n.language === 'ja' ? 'ja' : 'en');
  
  // For sidebar drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); 
  const [selectedMenu, setSelectedMenu] = useState('Inbox');

  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'info' });
  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };
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

  // Handler to toggle the drawer open/close state
  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    // Consider tab and shift key operations
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setIsDrawerOpen(open);
  };

  const handleAdd = (newJobInfo: UpdatedJobInfo) => {
    switch (newJobInfo.updateType) {
      case "new":
        // ToDo: Should replace a better way
        window.location.reload();
        break;
      default:
        break;
      }
      setOpenDialog(false);
      setIsDrawerOpen(false);
    };

  // Function to render the sidebar
  const drawerContent = (
    <Box
      sx={{ width: drawerWidth }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {Object.entries({
          'Add': <AddCircleOutlineIcon />,
          'Upload': <UploadFile />
        }).map(([text, icon], _) => (

          <ListItem key={text} disablePadding>
            <ListItemButton
              selected={selectedMenu === text}
              onClick={(e) => {
                  // Stop event propagation to prevent drawer from closing
                  e.stopPropagation();
                  setSelectedMenu(text);
                  switch (text) {
                    case 'Add':
                      setOpenDialog(true);
                      break;
                    case 'Upload':
                      setOpenUploadDialog(true);
                      break;
                    default:
                      break;
                  }
              }}
            >
              <ListItemIcon>
                {icon}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <React.Fragment>
      <CssBaseline />

      {/* ===== Header ===== */}
      <AppBar position="fixed" color="default" elevation={1}>
        <Toolbar>
          {/* Menu icon button */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer(true)}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            {t('mainTitle')}
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
      
      {/* Sidebar */}
      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={toggleDrawer(false)}
      >
        {drawerContent}
      </Drawer>

      {/* ===== Main Content Area  ===== */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: '32px' }}>
        {/* Add margin to avoid content being hidden behind AppBar */}       
        <Container sx={{ my: 4 }}>
          <Box mt={4}>
            <ItemList
              reloadTrigger={reloadTrigger}
              onUploadComplete={() => {
                setOpenUploadDialog(false);
                setIsDrawerOpen(false);
              }}
            />
          </Box>
        </Container>

        {/* "Upload" */}
        <UploadDialog
          openDialog={openUploadDialog}
          onClose={() => setOpenUploadDialog(false)}
          onUploadComplete={handleUploadSuccess}
        />
        {/* "Add new" */}
        <ItemDialog
          isForNew={true}
          openDialog={openDialog}
          onClose={() => setOpenDialog(false)}
          targetJobInfo={undefined}
          onSave={handleAdd}
        />

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
        {/* ===== Footer ===== */}
        <Box
          component="footer"
          sx={{
            py: 2,
            textAlign: 'center',
            borderTop: '1px solid #ddd',
            color: 'text.secondary',
            fontSize: 14,
            mt: 4,
          }}
        >
          © {new Date().getFullYear()} Job Info Extractor
        </Box>
      </Box>
    </React.Fragment>
  );
}

export default App;
