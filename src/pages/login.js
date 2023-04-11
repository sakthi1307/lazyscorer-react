import { Box, Button, Container, Grid, TextField, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'
import { userStore } from '../store';
const Login = () => {

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    await fetch('http://127.0.0.1:5000/login', {
      method: 'POST',
      body: data,
    }).then(res => res.json().then(data => {
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userStudent', data['user-type'])
        userStore.update(s => {
          s.isLoggedIn = true
          s.token = data.token
          s.userStudent = data['user-type']==='student'
        })

        window.location.href = '/';
      }
      if(data['error']){
        alert(data['error'])
      }
    }))
  }
  return (
  <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="h3">LazyScorer</Typography>
          <Typography variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit}  sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
        
              <Grid item>
                <Link to="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>)
}

export default Login
