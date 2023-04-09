import { Box, Button, Card, Chip, Container, FormControlLabel, Grid, Radio, RadioGroup, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
const Signup = () => {
    const [userTags, setUserTags] = useState(['default'])


    const handleEnter = async (e) => {
        if (e.key == "Enter") {
            e.preventDefault();
            if (e.target.value === '') {
                return
            }
            setUserTags([...userTags, e.target.value])
            e.target.value = ''
        }
        if (e.key == " ") {
            e.preventDefault();
        }
    }

    function handleChipClick(idx) {
        const oldArr = userTags.slice()
        oldArr.splice(idx, 1)
        setUserTags(oldArr)
    }
    useEffect(() => {
    }, [userTags]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        data.delete('user-tags')
        data.append('user-tags',userTags)
        await fetch('http://localhost:5000/register', {
            method: 'POST',
            body: data,
        }).then(res => res.json().then(data => {
                if(data['success']){alert("success")}
                if(data['error']){alert('user Exists with email')}
                window.location.href = '/';
            }
        ))
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
                <Typography component="h1" variant="h5">
                    Sign Up
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
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
                        autoComplete="new-password"
                    />
                    <Card elevation={0} sx={{backgroundColor:'#E9EDC9'}}>{userTags.map((data, i) =>
                        <Chip key={i} label={data} onClick={() => { handleChipClick(i) }} sx={{ margin: 1,backgroundColor:'#CCD5AE' }} />)}</Card>
                    <TextField
                        margin="normal"
                        fullWidth
                        name="user-tags"
                        label="User tags"
                        id="user-tags"
                        onKeyPress={handleEnter}

                    />

                    <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="student"
                        name="user-type"
                    >
                        <FormControlLabel value="student" control={<Radio/>}  label="student" />
                        <FormControlLabel value="Professor" control={<Radio />} label="Professor" />
                    </RadioGroup>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2,backgroundColor:'#94AF9F' }}
                    >
                        Sign UP
                    </Button>
                    <Grid container>

                        <Grid item>
                            <Link href="/" variant="body2">
                                {"Don't have an account? Sign In"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>)
}

export default Signup
