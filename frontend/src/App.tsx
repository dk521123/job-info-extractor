// App.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  ThemeProvider,
  createTheme,
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
  useMediaQuery,
  Tooltip,
  Divider,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import LanguageIcon from "@mui/icons-material/Language";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import UploadFile from "@mui/icons-material/UploadFile";
import SettingsApplicationsOutlined from "@mui/icons-material/SettingsApplicationsOutlined";

import UploadDialog from "./components/dialogs/UploadDialog";
import ItemDialog from "./components/dialogs/ItemDialog";
import SettingsDialog from "./components/dialogs/SettingsDialog";
import ItemList from "./components/ItemList";

import { useTranslation } from "react-i18next";
import type { UpdatedJobInfo } from "./types/JobInfo";
import { SettingsManager } from "./utils/SettingsManager";
import type { AppLanguage } from "./utils/SettingsManager";
import type { ThemeMode } from "./utils/SettingsManager";

const FULL_WIDTH = 240;
const MINI_WIDTH = 64;
const TRANSITION_MS = 240;

function App() {
  const { t, i18n } = useTranslation();

  // theme related
  const [themeMode, setThemeMode] = useState<ThemeMode>(
    SettingsManager.getThemeMode()
  );

  // language
  const [lang, setLang] = useState<AppLanguage>(SettingsManager.getLang());

  // data reload trigger
  const [reloadTrigger, setReloadTrigger] = useState(0);

  // dialogs
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSettingsDialog, setOpenSettingsDialog] = useState(false);

  // menu selection
  const [selectedMenu, setSelectedMenu] = useState<string>("menu");

  // snackbar
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info";
  }>({ open: false, message: "", severity: "info" });

  // Mobile detection - needs a theme. We'll create one from themeMode now.
  const baseTheme = useMemo(
    () =>
      createTheme({
        palette: { mode: themeMode },
      }),
    [themeMode]
  );
  const isMobile = useMediaQuery(baseTheme.breakpoints.down("md"));

  // Drawer states:
  // - sidebarPinned: if true -> expanded; if false -> collapsed (mini)
  // - mobileOpen: for temporary drawer on mobile
  const [sidebarPinned, setSidebarPinned] = useState<boolean>(() => {
    // restore from localStorage if available
    try {
      const v = localStorage.getItem("sidebarPinned");
      if (v === null) return true;
      return v === "true";
    } catch {
      return true;
    }
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    // Initialize language and theme from SettingsManager
    const L = SettingsManager.getLang();
    i18n.changeLanguage(L);
    setLang(L);

    setThemeMode(SettingsManager.getThemeMode());
  }, [i18n]);

  useEffect(() => {
    // persist pinned state
    try {
      localStorage.setItem("sidebarPinned", sidebarPinned ? "true" : "false");
    } catch {}
  }, [sidebarPinned]);

  const theme = baseTheme;

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleUploadSuccess = () => {
    setReloadTrigger((prev) => prev + 1);
    setOpenUploadDialog(false);
    setMobileOpen(false);

    // Keep previous behaviour (you had reload). If you'd prefer to avoid full reload, replace this.
    window.location.reload();
  };

  const handleChangeLanguage = (
    _: React.MouseEvent<HTMLElement>,
    newLang: AppLanguage
  ) => {
    if (!newLang) return;
    setLang(newLang);
    i18n.changeLanguage(newLang);
    SettingsManager.setLang(newLang);
  };

  const handleCloseSettingsDialog = () => {
    setOpenSettingsDialog(false);
    setMobileOpen(false);
  };

  const handleAdd = (newJobInfo: UpdatedJobInfo) => {
    // Usage same as before
    switch (newJobInfo.updateType) {
      case "new":
        window.location.reload();
        break;
      default:
        break;
    }
    setOpenDialog(false);
    setMobileOpen(false);
  };

  const menuItems = [
    { key: "add", label: t("addOnSidebar"), icon: <AddCircleOutlineIcon /> },
    { key: "upload", label: t("uploadOnSidebar"), icon: <UploadFile /> },
    {
      key: "settings",
      label: t("settingsOnSidebar"),
      icon: <SettingsApplicationsOutlined />,
    },
  ];

  const handleMenuClick = (key: string) => {
    setSelectedMenu(key);
    // On mobile, close the temporary drawer after selection
    if (isMobile) setMobileOpen(false);

    switch (key) {
      case "add":
        setOpenDialog(true);
        break;
      case "upload":
        setOpenUploadDialog(true);
        break;
      case "settings":
        setOpenSettingsDialog(true);
        break;
      case "menu":
      default:
        break;
    }
  };

  const handleThemeModeChange = (newMode: ThemeMode) => {
    setThemeMode(newMode);
    SettingsManager.setThemeMode(newMode);
  };

  // Drawer content as function so we pass expanded flag
  const drawerContent = (expanded: boolean) => (
    <Box
      sx={{
        width: expanded ? FULL_WIDTH : MINI_WIDTH,
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
      role="presentation"
      onKeyDown={() => {
        /* keyboard handling is managed by MUI Drawer */
      }}
    >
      {/* Top area: title + pin control */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: expanded ? "space-between" : "center",
          height: 64,
          px: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* Pin / unpin */}
          <Tooltip title={expanded ? t("closingSidebar") : t("openingSidebar")}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setSidebarPinned((prev) => !prev);
              }}
              aria-label="pin"
            >
              { expanded ? <MenuIcon /> : <MenuOpenIcon /> }
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Divider />

      {/* Menu list */}
      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.key} disablePadding sx={{ display: "block" }}>
              <Tooltip title={item.label}>
                <ListItemButton
                  selected={selectedMenu === item.key}
                  onClick={() => handleMenuClick(item.key)}
                  sx={{
                    minHeight: 48,
                    justifyContent: expanded ? "initial" : "center",
                    px: 2.5,
                    transition: `all ${TRANSITION_MS}ms`,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: expanded ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>

                  {expanded && <ListItemText primary={item.label} />}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );

  // outer layout - left permanent drawer on md+, temporary on xs/sm
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", height: "100vh", bgcolor: "background.default", color: "text.primary" }}>
        {/* AppBar */}
        <AppBar
          position="fixed"
          color="default"
          elevation={1}
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            transition: `margin-left ${TRANSITION_MS}ms, width ${TRANSITION_MS}ms`,
            ml: { md: `${sidebarPinned ? FULL_WIDTH : MINI_WIDTH}px` },
            width: {
              md: `calc(100% - ${sidebarPinned ? FULL_WIDTH : MINI_WIDTH}px)`
            },
          }}
        >
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
              {t("mainTitle")}
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center">
              <Tooltip title={t("switchingLanguage")}>
                <LanguageIcon color="action" />
              </Tooltip>
              <ToggleButtonGroup
                value={lang}
                exclusive
                onChange={handleChangeLanguage}
                aria-label="language toggle"
                size="small"
                color="primary"
              >
                <ToggleButton value="en">🅰️ {t("english")}</ToggleButton>
                <ToggleButton value="ja">あ {t("japanese")}</ToggleButton>
              </ToggleButtonGroup>
            </Stack>
          </Toolbar>
        </AppBar>

        {/* Permanent drawer for md+ */}
        <Box
          component="nav"
          sx={{
            width: { md: sidebarPinned ? FULL_WIDTH : MINI_WIDTH },
            flexShrink: { md: 0 },
            transition: `width ${TRANSITION_MS}ms`,
            borderRight: "1px solid",
            borderColor: "divider",
            height: "100vh",
            position: "relative",
            zIndex: 1200, // AppBar zIndex > drawer
          }}
          aria-label="mailbox folders"
        >
          <Drawer
            variant="permanent"
            open
            sx={{
              display: { xs: "none", md: "block" },
              "& .MuiDrawer-paper": {
                position: "relative",
                whiteSpace: "nowrap",
                width: sidebarPinned ? FULL_WIDTH : MINI_WIDTH,
                transition: `width ${TRANSITION_MS}ms`,
                overflowX: "hidden",
                boxSizing: "border-box",
              },
            }}
          >
            {drawerContent(sidebarPinned)}
          </Drawer>

          {/* Temporary Drawer for mobile */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: "block", md: "none" },
              "& .MuiDrawer-paper": { width: FULL_WIDTH },
            }}
          >
            {drawerContent(true)}
          </Drawer>
        </Box>

        {/* Main content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            pt: "80px", // space for AppBar
            transition: `margin-left ${TRANSITION_MS}ms`,
            ml: { md: 0 },
          }}
        >
          <Container sx={{ my: 4 }}>
            <Box mt={4}>
              <ItemList
                reloadTrigger={reloadTrigger}
                onUploadComplete={() => {
                  setMobileOpen(false);
                }}
              />
            </Box>
          </Container>

          {/* Upload dialog */}
          <UploadDialog
            openDialog={openUploadDialog}
            onClose={() => setOpenUploadDialog(false)}
            onUploadComplete={handleUploadSuccess}
          />

          {/* Add dialog */}
          <ItemDialog
            isForNew={true}
            openDialog={openDialog}
            onClose={() => setOpenDialog(false)}
            targetJobInfo={undefined}
            onSave={handleAdd}
          />

          {/* Settings dialog */}
          <SettingsDialog
            openSettingsDialog={openSettingsDialog}
            onCloseSettingDialog={() => handleCloseSettingsDialog()}
            currentThemeMode={themeMode}
            onThemeModeChange={handleThemeModeChange}
          />

          {/* Snackbar */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={4000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
              {snackbar.message}
            </Alert>
          </Snackbar>

          {/* Footer */}
          <Box
            component="footer"
            sx={{
              py: 2,
              textAlign: "center",
              borderTop: "1px solid",
              borderColor: "divider",
              color: "text.secondary",
              fontSize: 14,
              mt: 4,
            }}
          >
            © {new Date().getFullYear()} Job Info Extractor
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
