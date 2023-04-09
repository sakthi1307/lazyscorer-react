
import { Button, Card, CardActions, CardContent, Typography } from "@mui/material";
import * as React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import "chart.js/auto";                                         /////
import { Line } from "react-chartjs-2";



function AssignmentOverview() {

  const { id } = useParams();
  const [assignments, setAssignment] = useState([])
  const [submitted, setSubmitted] = useState([])
  const [scores, setScore] = useState([])
  const [graphData, setGraphData] = useState([])

  useEffect(() => {

    const token = localStorage.getItem("token")
    const formData = FormData()
    formData.append('assignment_id')
    fetch('http://127.0.0.1:5000/assignment_overview', {
      method: 'POST',
      headers: new Headers({
        'Authorization': 'Bearer ' + token
      })
    }).then(res => res.json().then(data => {
      setAssignment(data['assignments'])
      setSubmitted(data['submitted']);
      let scores = []
      data['submitted'].map((data, i) => {
        scores.push(data['scores'].reduce((a, b) => a + b, 0))
      })
      setScore(scores);

    }))
  }, [])



  return (
    <div>
      <Typography variant="h4">Assignments</Typography>


      {scores &&
        <Card>
          <Line
            sx={{ minWidth: 275 }}
            data={{ labels: Array.from(Array(scores.length).keys()), datasets: [{ label: 'All Assignments', data: scores }] }}
          />
        </Card>}

      {
        assignments.map((data, i) => {
          return (<Card sx={{ minWidth: 275, margin: 2 }} key={i} variant="outlined">
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


    </div>)

}

export default AssignmentOverview

