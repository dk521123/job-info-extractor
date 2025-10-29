import React, { useState, useEffect } from 'react';
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
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import UploadFile from '@mui/icons-material/UploadFile';
import SettingsApplicationsOutlined from '@mui/icons-material/SettingsApplicationsOutlined';

import UploadDialog from './components/UploadDialog';
import ItemDialog from './components/ItemDialog';
import SettingsDialog from './components/SettingsDialog';
import ItemList from './components/ItemList';

import { useTranslation } from 'react-i18next';
import type { UpdatedJobInfo } from './types/JobInfo';
import { SettingsManager } from './utils/SettingsManager';
import type { AppLanguage } from './utils/SettingsManager';

// Width of the drawer in sidebar
const drawerWidth = 240;

function App() {
  const { t, i18n } = useTranslation();
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [lang, setLang] = useState<AppLanguage>(SettingsManager.getLang());
  
  // For sidebar drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); 
  const [selectedMenu, setSelectedMenu] = useState('Inbox');

  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const [openSettingsDialog, setOpenSettingsDialog] = useState(false);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    // Initialize for lang
    const lang = SettingsManager.getLang();
    i18n.changeLanguage(lang);
  }, []);

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleUploadSuccess = () => {
    setReloadTrigger((prev) => prev + 1);
    setOpenUploadDialog(false);
    setIsDrawerOpen(false);

    // ToDo: Should replace a better way
    window.location.reload();
  };

  const handleChangeLanguage = (
    _: React.MouseEvent<HTMLElement>,
    newLang: AppLanguage
  ) => {
    setLang(newLang);
    i18n.changeLanguage(newLang);
    SettingsManager.setLang(newLang);
  };

  const handleCloseSettingsDialog = () => {
    setOpenSettingsDialog(false);
    setIsDrawerOpen(false);
  }

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
          'menu': [<MenuIcon />, t('menuOnSidebar')],
          'add': [<AddCircleOutlineIcon />, t('addOnSidebar')],
          'upload': [<UploadFile />, t('uploadOnSidebar')],
          'settings': [<SettingsApplicationsOutlined />, t('settingsOnSidebar')]
        }).map(([menuKey, [icon, text]], _) => (
          <ListItem key={menuKey} disablePadding>
            <ListItemButton
              selected={selectedMenu === menuKey}
              onClick={(e) => {
                  // Stop event propagation to prevent drawer from closing
                  e.stopPropagation();
                  setSelectedMenu(menuKey);
                  switch (menuKey) {
                    case 'add':
                      setOpenDialog(true);
                      break;
                    case 'upload':
                      setOpenUploadDialog(true);
                      break;
                    case 'settings':
                      setOpenSettingsDialog(true);
                      break;
                    case 'menu':
                    default:
                      setIsDrawerOpen(false);
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

        {/* "Add" */}
        <ItemDialog
          isForNew={true}
          openDialog={openDialog}
          onClose={() => setOpenDialog(false)}
          targetJobInfo={undefined}
          onSave={handleAdd}
        />

        {/* "Settings" */}
        <SettingsDialog
          openSettingsDialog={openSettingsDialog}
          onCloseSettingDialog={() => handleCloseSettingsDialog() }
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
