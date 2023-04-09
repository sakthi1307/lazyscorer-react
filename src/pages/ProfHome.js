
import { Button, Card, CardActions, CardContent, Fab, Typography } from "@mui/material";
import * as React from "react";

import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import "chart.js/auto";                                         /////
import AddIcon from '@mui/icons-material/Add';



function ProfHome() {

  const [assignments, setAssignment] = useState([])
  const [submitted, setSubmitted] = useState([])
  const [scores, setScore] = useState([])

  useEffect(() => {

    const token = localStorage.getItem("token")

    fetch('http://127.0.0.1:5000/getassigned', {
      method: 'GET',
      headers: new Headers({
        'Authorization': 'Bearer ' + token
      })
    }).then(res => res.json().then(data => {
      console.log(data)
      setAssignment(data['asignments'])
    }))
  }, [])



  return (
    <div>
      <Typography variant="h4">Assignments</Typography>
      {assignments.map((data, i) => {
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
            <Link to={`viewassignment/${data['_id']['$oid']}`} style={{textDecoration:'none',color:'#8AB4F8'}}>
              <Button size="small" variant="outlined" sx={{backgroundColor:'#94AF9F',textDecoration:'none'}}>View Assignment</Button>
            </Link>
          </CardActions>
        </Card>)
      })

      }
              <Link to="/new-assignment" style={{display:'block',position:'fixed',width:'60px',height:'60px',bottom:'40px',
	right:'40px'}}> 

      <Fab >
        <AddIcon/>
        
      </Fab>
      </Link>
    </div>)

}

export default ProfHome

