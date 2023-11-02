import {ChatContextProvider } from "./context/chatContext";
import SideBar from "./components/SideBar";
import ChatView from "./components/ChatView";
import { useEffect, useState } from "react";

import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
} from "@mui/material";
import { Menu } from "@mui/icons-material";
import Title from "./components/Title";

const App = () => {
  // const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openDrawer = () => {
    setDrawerOpen(true);
  }

  const closeDrawer = () => {
    setDrawerOpen(false);
  }

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };


  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  // Modal for the first time user 
  const [openFirst, setOpenFirst] = useState(false);
  const [accepted, setAccepted] = useState(false);
  useEffect(() => {
    const data = localStorage.getItem("firstTime");
    const accepted = localStorage.getItem("accepted");
    if (data === null || data === undefined || accepted === null || accepted === undefined || accepted === "false") {
      setOpenFirst(true);
      localStorage.setItem("firstTime", "false");
    }
  }, []);

  const handleAccepted = () => {
    setAccepted(true);
    localStorage.setItem("accepted", "true");
    setOpenFirst(false);
    localStorage.setItem("firstTime", "false");
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <ChatContextProvider>
        <Dialog open={openFirst} handleClose={() => setOpenFirst(false)}>
          <DialogTitle>Terms and Conditions</DialogTitle>
          <Divider />
          <DialogContent>
            <DialogContentText>
              <Typography variant="h6" gutterBottom>
              SCI-PHI CHATBOT SERVICE TERMS AND CONDITIONS
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Welcome to SciPhi! Please read these Terms and Conditions ("Terms") fully and carefully before using the SciPhi Chatbot Service ("Service"). These Terms govern your access to and use of the Service, and constitute a binding legal agreement between you and SciPhi.
              </Typography>
              <Typography variant="h6" gutterBottom>
                ACCEPTANCE OF TERMS
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                By using our Service, you agree to be bound by these terms, all applicable laws and regulations, and any other applicable policies and guidelines.
              </Typography>
              <Typography variant="h6" gutterBottom>
                USE OF THE CHATBOT SERVICE
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                2.1 You agree to use the SciPhi Chatbot Service only for purposes that are in accordance with these Terms and any applicable laws, regulations, or generally accepted practices in the relevant jurisdictions.
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                2.2 SciPhi reserves the right to modify or discontinue, temporarily or permanently, the Service or any features or portions thereof without prior notice.
              </Typography>
              <Typography variant="h6" gutterBottom>
                USER RESPONSIBILITY
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                3.1 The user is responsible for any damages caused by their use of the Service. This includes, but is not limited to, damages to the functioning of the chatbot, reputation damage, or any other kind of damage.
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                3.2 The User assumes responsibility for any and all damages and generations resulting from their interaction with the Service.
              </Typography>
              <Typography variant="h6" gutterBottom>
                CONTENT
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                4.1 You understand that all information, such as data files, written content, computer software, music, audio files or other sounds, photographs, videos, or other images that you transmit to SciPhi are solely your responsibility.
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                4.2 While SciPhi reserves the right to review and remove content that violates these Terms, such content is the sole responsibility of the user who transmits it.
              </Typography>
              <Typography variant="h6" gutterBottom>
                LIMITATION OF LIABILITY
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                To the maximum extent permitted by applicable law, SciPhi will not be liable for any direct, indirect, incidental, special, consequential, or punitive damages resulting from the use of the Service, regardless of whether SciPhi has been advised of the possibility of such damages.
              </Typography>
              <Typography variant="h6" gutterBottom>
                DISCLAIMER OF WARRANTIES
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                SciPhi provides the Service “as is” and “as available” without any warranties, either expressed or implied. SciPhi makes no warranty that the Service will meet your requirements or be available uninterrupted, secure, or error-free.
              </Typography>
              <Typography variant="h6" gutterBottom>
                MODIFICATION OF TERMS
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                SciPhi may modify these Terms at any time, and by continuing to use the Service, you are agreeing to the modified Terms.
              </Typography>
              <Typography variant="h6" gutterBottom>
                GOVERNING LAW
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                These Terms shall be governed and construed in accordance with the laws of the jurisdiction where SciPhi operates.
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                By using this Service, you signify your acceptance of these Terms and Conditions. If you do not agree to these Terms, please refrain from using the SciPhi Chatbot Service.
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Contact Information:<br />
                If you have any questions about these Terms, please contact us.
              </Typography>
            <DialogActions>
              <Button onClick={() => handleAccepted()}variant="contained" fullWidth >Accept</Button>
            </DialogActions>
            </DialogContentText>
          </DialogContent>

        </Dialog>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <AppBar position="fixed" sx={{ width: { sm: `calc(100% - ${280}px)` }, ml: { sm: `${280}px` } }}>
            <Toolbar>
              <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: "none" } }}>
                <Menu />
              </IconButton>
              <Typography variant="h6" noWrap component="div">
               <Title />
              </Typography>
            </Toolbar>
          </AppBar>
          <Box component="nav" sx={{ width: { sm: 280 }, flexShrink: { sm: 0 } }} aria-label="Sidebar">
            <SideBar drawerOpen={drawerOpen} changeDrawer={() => handleDrawerToggle()} opDrawer={() => openDrawer()} clDrawer={() => closeDrawer()} />
          </Box>
          <Box component="main" sx={{ flexGrow: 1, width: { sm: `calc(100% - ${280}px)` } }}>
            <Toolbar />
            <ChatView />
          </Box>
        </Box>

      </ChatContextProvider>
    </ThemeProvider>
  );
};

export default App;
