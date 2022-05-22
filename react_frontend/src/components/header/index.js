import React, {useState} from 'react';
// import {AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Button, Tooltip, MenuItem} from '@mui/material';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import {Link} from 'react-router-dom'
import LoginComponent from '../login/LoginComponent'
import { getDefaultSession } from '@inrupt/solid-client-authn-browser';
import {useRecoilState} from 'recoil'
import { sessionTrigger as t } from '../../atoms';
import {v4} from 'uuid'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';

const ResponsiveAppBar = ({pages}) => {
  const [trigger, setTrigger] = useRecoilState(t)

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [openAuthDialog, setOpenAuthDialog] = useState(false)

  const onLogoutClick = async (e) => {
    await getDefaultSession().logout()
    setTrigger(v4())
}

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <React.Fragment>
    <AppBar position="static">
      <Container maxWidth={false}>
        <Toolbar disableGutters>
            {/* mobile */}
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to={"/"}
            sx={{ mr: 2, display: { xs: 'none', md: 'block' }, color: "white" }}
          >
            LBDserver
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'block', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
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
              {pages.map((page) => (
                <MenuItem key={page.label} onClick={handleCloseNavMenu}>
                  <Button component={Link} to={page.path} style={{textAlign: "center"}}>{page.label}</Button>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          
            {/* desktop */}
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to={"/"}
            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
          >
            LBDserver
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
              component={Link}
                key={page.label}
                to={page.path}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page.label}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              {getDefaultSession().info.isLoggedIn ? (
                    <AccountCircleIcon style={{fill: "white"}} />
                  ) : (
                    <NoAccountsIcon style={{fill: "white"}} />
                  )}
              </IconButton>
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
                <MenuItem key={"login"} onClick={handleCloseUserMenu}>
                  {getDefaultSession().info.isLoggedIn ? (
                    <Button onClick={onLogoutClick} style={{textAlign: "center"}}>Logout</Button>
                  ) : (
                    <Button onClick={() => setOpenAuthDialog(true)} style={{textAlign: "center"}}>Login</Button>
                  )}
                </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
    <LoginComponent open={openAuthDialog} onClose={() => setOpenAuthDialog(false)}/>
    </React.Fragment>

  );
};
export default ResponsiveAppBar;