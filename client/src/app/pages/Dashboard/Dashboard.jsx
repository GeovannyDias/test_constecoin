import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { useState } from "react";

import { Navbar } from "../../shared/components/Navbar/Navbar";
import { Sidebar } from "../../shared/components/Sidebar/Sidebar";
import { TableData } from "../../components/TableData/TableData";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

export function Dashboard() {
  const [open, setOpen] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  // USER SUBMENU
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Navbar
        open={open}
        handleDrawerOpen={handleDrawerOpen}
        handleMenu={handleMenu}
        handleClose={handleClose}
        anchorEl={anchorEl}
      />
      <Sidebar open={open} handleDrawerClose={handleDrawerClose} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <TableData />
      </Box>
    </Box>
  );
}
