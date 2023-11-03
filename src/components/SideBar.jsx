import { useEffect, useContext } from "react";
import { ChatContext } from "../context/chatContext";

/**
 * MUI imports.
 */
import Drawer from "@mui/material/Drawer";
import { Add, Close, Delete, Public } from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  IconButton,
  List,
  Link,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

import logo from "../assets/logo.png";
/**
 * A sidebar component that displays a list of nav items and a toggle
 * for switching between light and dark modes.
 *
 * @param {Object} props - The properties for the component.
 */
{
  /* <SideBar drawerOpen={drawerOpen} changeDrawer={handleDrawerToggle} /> */
}
const SideBar = (props) => {
  const { drawerOpen, changeDrawer, clDrawer, opDrawer } = props;
  const [
    conversations,
    currentConversation,
    selectConversation,
    addConversation,
    deleteConversation,
    ,
    clearChat,
  ] = useContext(ChatContext);

  function handleResize() {
    window.innerWidth <= 720 ? clDrawer() : opDrawer();
  }
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
  }, []);

  function clear() {
    clearChat();
  }

  const drawerContent = (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="https://sciphi.ai" underline="none">
          <Box
            sx={{
              display: "flex",
              pt: 2,
              pb: 1.9,
              ml: 2,
              justifyContent: "space-between",
              alignItems: "center", // To align items perfectly inline.
            }}
          >
            <img
              src={logo}
              alt="logo"
              width="32px"
              height="32px"
              sx={{ marginRight: 1 }}
            />{" "}
            {/* Added marginRight for slight separation */}
            <Typography variant="h6" noWrap sx={{ pl: 1, color: "white" }}>
              SciPhi
            </Typography>
            <Button
              onClick={changeDrawer}
              sx={{ display: { xs: "block", sm: "none" } }}
            >
              {/* Your button content here */}
            </Button>
          </Box>
        </Link>

        {/* <img src={logo} alt="logo" width="50px" height="50px" />
        <Typography variant="h6" noWrap sx={{ ml: 1, mt: 1, mb: 1 }}>
          SciPhi
        </Typography> */}
        <Button
          onClick={changeDrawer}
          sx={{ display: { xs: "block", sm: "none" } }}
        >
          <Close size={25} />
        </Button>
      </Box>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={addConversation}>
            <ListItemIcon>
              <Add />
            </ListItemIcon>
            <ListItemText primary="New conversation" />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
        
      {/* MessageLinks come here */}
      {conversations.map((conversation) => (
  
        <ListItemButton 
          disablePadding
          dense={true}
          onClick={() => selectConversation(conversation.uuid)}  
          key={conversation.uuid}
          selected={currentConversation?.uuid === conversation.uuid}>
            <ListItemIcon sx={{
              maxWidth: "24px",
              minWidth: "24px",
              width: "24px",
              marginRight: "6px",
            }}>
              <Public />
            </ListItemIcon>
            {/* we need to limit conversation.title to 20 chars, and add ellipses at the end */}
            <ListItemText primary={`${conversation.title.substring(0, 20)}${conversation.title.length > 20 ? "..." : ""}`}
            />
          <IconButton onClick={() => deleteConversation(conversation.uuid)}>
            <Delete />
          </IconButton>
        </ListItemButton>
      ))}
      <Divider />
    </>
  );

  const container =
    window !== undefined ? () => window.document.body : undefined;

  return (
    <>
      <Drawer
        container={container}
        variant="temporary"
        open={drawerOpen}
        onClose={changeDrawer}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 280 },
        }}
      >
        {drawerContent}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 280 },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default SideBar;
