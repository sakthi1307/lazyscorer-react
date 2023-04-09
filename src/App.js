import * as React from "react";
import { Routes, Route, Outlet, Link } from "react-router-dom";
import { userStore } from './store'
import { useEffect } from "react"
import './App.css'
import Home from "./pages/home";
import Login from "./pages/login"
import { AppBar, Box, Button, Container, Fab, Toolbar, Tooltip, Typography } from "@mui/material";
import Assigment from "./pages/Assignment";
import Submitted from "./pages/Submitted";
import Signup from "./pages/Signup";
import SetAssignment from "./pages/SetAssignment";
import ProfHome from "./pages/ProfHome";
import Submissions from "./pages/Submissions";
import LogoutIcon from '@mui/icons-material/Logout';

const logout = () => {
  userStore.update(s => {
    s.isLoggedIn = false
    s.token = ""
    s.user = {}
    s.userStudent = false
  })
  localStorage.removeItem("token")
  localStorage.removeItem("userStudent")
  window.location.href = "/"
}

export default function App() {

  const isLoggedIn = userStore.useState(s => s.isLoggedIn);
  const userStudent = userStore.useState(s => s.userStudent)
  useEffect(() => {
    const token = localStorage.getItem("token")
    const userStu = localStorage.getItem("userStudent")
    if (!!token) {
      userStore.update(s => {
        s.isLoggedIn = true;
        s.token = token;
        s.userStudent = userStu === 'student'
      })

    }

  }, [])

  useEffect(() => { }, [userStudent])

  return (

    !isLoggedIn ? (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    ) : (
      <Routes>
        <Route path="/" element={<Layout userType={userStudent} />} >
          {userStudent && <><Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="assignment/:id" element={<Assigment />} />
            <Route path="submitted/:id" element={<Submitted />} />
            <Route path="dashboard" element={<Dashboard />} />
          </>
          }
          {!userStudent &&
            <>
              <Route index element={<ProfHome />} />
              <Route path="new-assignment" element={<SetAssignment />} />
              <Route path="viewassignment/:assignment_id" element={<Submissions />} />
            </>}

          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    )



  );
}

function Layout({ userStudent }) {

  return (
    <div>
      <AppBar position="static">
        <Container maxWidth="xl" sx={{ backgroundColor: '#159895' }}>
          <Toolbar disableGutters sx={{ justifyContent: 'space-between', color: '#FEFEFE' }}>
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
              LazyScorer
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>

            </Box>
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
              LazyScorer
            </Typography>


            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Logout">
                <LogoutIcon onClick={logout} sx={{ p: 0 }} />
              </Tooltip>

            </Box>
          </Toolbar>
        </Container>
      </AppBar>
 
      <Outlet />

    </div>
  );
}


function About() {
  return (
    <div>
      <h2>About</h2>
    </div>
  );
}

function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
    </div>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}


