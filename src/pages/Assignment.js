import { Button, Card, CardContent, Paper, Typography } from "@mui/material";
import * as React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Input } from '@mui/material';
import { Box } from "@mui/system";

function Assigment() {
    const { id } = useParams();
    const [assignments, setAssignment] = useState([])
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem("token")
        const formData = new FormData();
        formData.append("assignment_id", id)
        fetch('http://127.0.0.1:5000/assignment', {
            method: 'POST',
            headers: new Headers({
                'Authorization': 'Bearer ' + token
            }),
            body: formData
        }).then(res => res.json().then(data => {
            console.log(data['assignment'])
            setAssignment(data['assignment'])
        }))
    }, [])

    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem("token")
        const formData = new FormData();

        formData.append("test-id", id)
        formData.append("file", file)
        try {
            setLoading(true)
            await fetch('http://127.0.0.1:5000/submitassignment', {
                method: 'POST',
                headers: new Headers({
                    'Authorization': 'Bearer ' + token
                }),
                body: formData
            }).then(res => res.json().then(data => {
                // alert(data)

                setLoading(false)
                if (data['error']) {
                    alert(data['error'])
                    return
                }
                window.location.href = `/submitted/${data['assignment_id']}`;
            }))
        } catch (error) {
            console.error(error)
        }
    }

    return (
        assignments.length != 0 ? (
            <div>

                {assignments['title'] &&
                    <Typography variant="h5" component="div">
                        {assignments['title']}
                    </Typography>
                }
                <Typography variant="h6">Assignment {id}</Typography>
                {assignments['description'] &&
                    <Typography variant="body" component="div">
                        {assignments['description']}
                    </Typography>
                }
                <Typography sx={{ fontSize: 12 }} color="text.secondary">
                    Set on : {assignments['date_created']['$date']}
                </Typography>
                <Typography variant="body2">

                    Due date: {assignments['date_due']['$date']}
                </Typography>

                <Card sx={{ margin: 1 }} variant="outlined">
                    <CardContent  >
                        <Typography variant="h5" sx={{ marginBottom: 2 }}>Questions</Typography>
                        {
                            assignments['questions'].map((data, i) => {
                                return (

                                    <Typography sx={{ fontSize: 14 }} key={i}>
                                        {i + 1}. {data['question']}
                                    </Typography>


                                )
                            })

                        }
                    </CardContent>
                </Card>


                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Paper elevation={10} sx={{ 'margin': 1, padding: 2 }}>
                        <Typography variant="h5">Submit Assigment</Typography>

                        <Typography variant="caption" color="text.secondary">

                            <ol>
                                <li>Make sure you have completed all the questions in the assignment.</li>
                                <li>Save your assignment as a single document PDF.</li>
                                <li>Name your document file appropriately, using a clear and descriptive title that includes your name and the assignment name.</li>
                                <li>Check the number of pages in your document to ensure that they match the number of questions in the assignment.</li>
                                <li><b>You are permitted only one page exactly per question .</b></li>
                                <li><b>You are not permitted to change the order of the questions .</b></li>
                                <li>Review your document to ensure that it is clear, legible, and free from errors or formatting issues.</li>
                            </ol>
                        </Typography>
                        <br />
                        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                        <br />

                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ mt: 2 }}
                            disabled={loading}
                        >
                            Submit
                        </Button>
                        {loading && <Typography variant="subtitle1">loading</Typography>}
                    </Paper>
                </Box>
            </div>) : (<div>Assignment Not found</div>)
    );
}

export default Assigment;