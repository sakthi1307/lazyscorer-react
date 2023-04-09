import { Button, Card, CardContent, Paper, Typography } from "@mui/material";
import * as React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Input } from '@mui/material';
import { Box } from "@mui/system";

function Submitted() {
    const { id } = useParams();
    const [assignments, setAssignment] = useState(null)
    const [submitted, setSubmitted] = useState(null)
    const [loading,setLoading] = useState(false)

    const [file, setFile] = useState(null);


    useEffect(() => {
        const token = localStorage.getItem("token")
        const formData = new FormData();
        formData.append("assignment_id", id)
        fetch('http://127.0.0.1:5000/submitted', {
            method: 'POST',
            headers: new Headers({
                'Authorization': 'Bearer ' + token
            }),
            body: formData
        }).then(res => res.json().then(data => {
            console.log(data['submitted'])
            setAssignment(data['assignment'])
            setSubmitted(data['submitted'])
        }))
    }, [])

    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem("token")
        const formData = new FormData();

        formData.append("assignment_id", id)
        try {
            setLoading(true)

            await fetch('http://127.0.0.1:5000/setscore', {
                method: 'POST',
                headers: new Headers({
                    'Authorization': 'Bearer ' + token
                }),
                body: formData
            }).then(res => res.json().then(data => {
                setLoading(false)
                window.location.reload(false);

            }))
        } catch (error) {
            console.error(error)
        }
    }

    return (
        assignments ? (
            <div>

                <Typography variant="h6">Assignment {id}</Typography>
            
                <Typography sx={{ fontSize: 12 }} color="text.secondary">
                    Submitted on : {submitted['submitted_on']['$date']}
                </Typography>
           

                <Card sx={{ minWidth: 275, margin: 2, backgroundColor: '#E9EDC9' }} variant="outlined">
                    <CardContent  >
                        <Typography variant="h5" sx={{ marginBottom: 2 }}>Questions</Typography>
                        {
                            assignments['questions'].map((data, i) => {
                                return (
                                    <>
                                        <Typography sx={{ fontSize: 14 }} key={i}>
                                            {i + 1}. {data['question']}
                                        </Typography>
                                        {submitted['scores'] &&                        
                                        <Typography sx={{ fontSize: 13 }} key={i}  color="HighlightText">
                                            Score: {submitted['scores'][i]}
                                        </Typography>}
                                    </>
                                )
                            })

                        }
                    </CardContent>
                </Card>

                {!submitted['scores'] &&
                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <Paper elevation={10} sx={{ 'margin': 1, padding: 2 }}>
                            <Typography variant="h5">Score Assigment</Typography>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{ mt: 2 }}
                                disabled={loading}

                            >
                                Score
                            </Button>
                        </Paper>
                    </Box>}
            </div>) : (<div>Submission Not found</div>)
    );
}

export default Submitted;