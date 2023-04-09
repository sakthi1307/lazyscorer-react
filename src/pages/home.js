import { Box, Button, Card, CardActions, CardContent, Typography } from "@mui/material";
import * as React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import "chart.js/auto";
import { Line } from "react-chartjs-2";



function Home() {

  const [assignments, setAssignment] = useState([])
  const [submitted, setSubmitted] = useState([])
  const [scores, setScore] = useState([])
  const [graphData, setGraphData] = useState([])

  useEffect(() => {

    const token = localStorage.getItem("token")

    fetch('http://127.0.0.1:5000/getassignments', {
      method: 'GET',
      headers: new Headers({
        'Authorization': 'Bearer ' + token
      })
    }).then(res => res.json().then(data => {
      setAssignment(data['assignments'])
      setSubmitted(data['submitted']);
      let scores = []
      data['submitted'].map((data, i) => {
        scores.push(Math.abs((data['scores'].reduce((a, b) => a + b, 0)) / data['scores'].length))
      })
      setScore(scores);

    }))
  }, [])



  return (
    <div>
      <Typography variant="h4">Assignments</Typography>
      {
        assignments.map((data, i) => {
          return (<Card sx={{ minWidth: 275, margin: 2, backgroundColor: '#E9EDC9' }} key={i} variant="outlined">
            <CardContent>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Assignment ID {data['_id']['$oid']}
              </Typography>
              {data['title'] &&
                <Typography variant="h5" component="div">
                  {data['title']}
                </Typography>
              }
              <Typography sx={{ fontSize: 10 }} color="text.secondary">
                Set on : {data['date_created']['$date']}
              </Typography>
              <Typography variant="body2">

                Due date: {data['date_due']['$date']}

              </Typography>
            </CardContent>
            <CardActions>
              <Link to={`assignment/${data['_id']['$oid']}`}>
                <Button size="small">View Assignment</Button>
              </Link>
            </CardActions>
          </Card>)
        })

      }
      <Typography variant="h4">Assignments submitted</Typography>

      {scores &&
               <Box sx={{ display: 'flex', alignContent: 'center', justifyContent:'center'}}>
               <Card sx={{width:'50%' }}>
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
        </Box>}

      {
        submitted.map((data, i) => {
          return (<Card sx={{ minWidth: 275, margin: 2, backgroundColor: '#E9EDC9' }} key={i} variant="outlined">

            <CardContent>

              {data['title'] ?
                <Typography variant="h5" component="div">
                  {data['title']}
                </Typography> : <>
                  <Typography variant="body2" sx={{ fontSize: 12 }}>

                    Assignment ID {data['test_id']['$oid']}
                  </Typography>
                  
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" >
                    Submission ID {data['_id']['$oid']}<br></br></Typography>

                </>}
              <Typography variant="body2" sx={{ fontSize: 11 }}>
                Submitted on : {data['submitted_on']['$date']}
              </Typography>
              {!data['scores'] && <Typography color={"red"}> Not scored</Typography>}
            </CardContent>
            <CardActions>
              <Link to={`submitted/${data['_id']['$oid']}`}>
                <Button size="small">View Assignment</Button>
              </Link>
            </CardActions>
          </Card>)
        })

      }
    </div>)

}

export default Home

