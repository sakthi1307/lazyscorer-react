
import { Button, Card, CardActions, CardContent, Typography, Box } from "@mui/material";

import * as React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "chart.js/auto";                                         /////
import { Line } from "react-chartjs-2";


function Submissions() {

  const { assignment_id } = useParams()
  const [assignments, setAssignment] = useState([])
  const [scores, setScore] = useState([])

  useEffect(() => {

    const token = localStorage.getItem("token")

    const formData = new FormData()
    formData.append('assignment_id', assignment_id)
    fetch('http://127.0.0.1:5000/assignment_overview', {
      method: 'POST',
      headers: new Headers({
        'Authorization': 'Bearer ' + token
      }),
      body: formData
    }).then(res => res.json().then(data => {
      console.log(data)
      setAssignment(data['submitted'])
      let scores = []
      data['submitted'].map((data, i) => {
        scores.push((data['scores'].reduce((a, b) => a + b, 0)) / data['scores'].length)
      })
      setScore(scores);
    }))
  }, [])

  useEffect(() => { }, [assignments, scores])

  const get_assignment = (uri) => {

  }


  return (
    <div>
      <Typography variant="h4">Submissions</Typography>
      <Typography variant="h6">Id{assignment_id}</Typography>
      {scores.length>0 ?
        <Box sx={{ display: 'flex', alignContent: 'center', justifyContent:'center'}}>
          <Card sx={{width:'50%' }}
          >
            <Line
              data={{
                labels: Array.from(Array(scores.length + 1).keys()).slice(1),
                datasets: [{ label: 'All Assignments', data: scores }],

              }}
              options={{
                scales: {
                  y: {
                    suggestedMax: 100,
                    suggestedMin: 0
                  }
                }
              }}
            />
          </Card>
        </Box>
        : <Typography variant="h6" color="red">No Submissions.</Typography>}
      {assignments.map((data, i) => {
        return (<Card sx={{ minWidth: 275, margin: 2, backgroundColor: '#94AF9F' }} key={i} variant="outlined">
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Submission ID {data['_id']['$oid']}
            </Typography>
            <Typography sx={{ fontSize: 10 }}>Submitted By:{data['submitted_by']['$oid']}</Typography>
            {data['title'] &&
              <Typography variant="h5" component="div">
                {data['title']}
              </Typography>
            }
            {data['scores'] ? <Typography sx={{ fontSize: 12 }}><b>Score: </b>{(data['scores'].reduce((a, b) => a + b, 0)) / data['scores'].length}</Typography> : <Typography color={"red"}>Not scored</Typography>}

          </CardContent>
          <CardActions>
            <a href={`http://127.0.0.1:5000/downloadpdf/${data['pdf_link']}`} >
              <Button size="small">View Submission</Button>
            </a>
          </CardActions>
        </Card>)
      })

      }

    </div>)

}

export default Submissions

