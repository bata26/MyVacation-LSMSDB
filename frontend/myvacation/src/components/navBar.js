import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { useNavigate } from "react-router-dom";

import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';

//Pagine navBar
const pages = ["signIn", "signUp"];

// Pagine a tendina logo utente
const account = ['Profile', 'MyAdv', 'Logout'];

function ResponsiveAppBar() {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const role = localStorage.getItem("role");

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const ChangePage = (pagePath) => {
    console.log("sono dentro -> path : ", pagePath);
    pagePath = (pagePath === "/home") ? "/" : pagePath;
    navigate(pagePath);
  }

  const handleCloseUserMenu = (selectedSetting) => {
    console.log(selectedSetting);

    if (selectedSetting === 'Profile') {
      if (localStorage.getItem("role") === "admin")
        ChangePage('/admin')
      else
        ChangePage('/profile')
    }
    else if (selectedSetting === 'Logout') {
      localStorage.clear();
      //localStorage.setItem("role", null);
      ChangePage('/');
    } else if (selectedSetting === 'MyAdv') {
      ChangePage('/myadv');
    }
    setAnchorElUser(null);
  };

  React.useEffect(() => {
    console.log(localStorage.getItem("userID"));
  });

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            MyVacation
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {
                pages.map((page) => (
                  <MenuItem key={page} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))
              }
              <MenuItem key="search" onClick={handleCloseNavMenu}>
                <Typography textAlign="center">search</Typography>
              </MenuItem>
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            MyVacation
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {
              (localStorage.getItem("userID") == null || !localStorage.getItem("userID")) ?
                (
                  pages.map( page => (
                    <Button
                      key={page}
                      onClick={() => ChangePage("/" + page)}
                      sx={{ my: 2, color: 'white', display: 'block' }}
                    >
                      {page}
                    </Button>
                  ))
                ) : <></>
            }
            <Button
              key="search"
              onClick={() => ChangePage("/search")}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              search
            </Button>
          </Box>
          {localStorage.getItem("userID") != null && localStorage.getItem("userID") ?
            (<Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open account">
                {/*<Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />*/}
                <AccountCircleRoundedIcon fontSize='large' onClick={handleOpenUserMenu} />
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {account.map((setting) => (
                  <MenuItem key={setting} onClick={() => handleCloseUserMenu(setting)}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>) : <></>}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;