import { Box, Button, Card, Checkbox, Chip, Container, Divider, FormControlLabel, Grid, List, ListItem, ListItemText, Paper, Radio, RadioGroup, TextField, Typography } from '@mui/material'
import IconButton from '@mui/material/IconButton';
import React, { useEffect, useReducer, useRef, useState,Fragment } from 'react'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import DeleteIcon from '@mui/icons-material/Delete';
import { userStore } from '../store';
import dayjs from 'dayjs';

const SetAssignment = () => {
  const [userTags, setUserTags] = useState(['default'])
  const questionForm = useRef('')
  const questionRef = useRef(null)
  const answerRef = useRef(null)
  const answerForm = useRef('')
  const dateRef = useRef('')
  const [questions, setQuestions] = useState([])
  const token = userStore.useState(s => s.token)
  const format = 'YYYY-MM-DD';

  const handleAnswerKeyPress = (e) => {
    if (e.key == "Enter") {
      e.preventDefault();
      const question = questionRef.current.value
      const answer = answerRef.current.value

    if(question==""){
        alert("question empty")
        return;
      }

      setQuestions([...questions, { question: question, answer: answer }])

      questionRef.current.value = ''
      answerRef.current.value = ''
    }

  }

  const removeItem = (idx) => {

    const oldArr = questions.slice()
    oldArr.splice(idx, 1)
    setQuestions(oldArr)
  }
  const handleQuestionKeyPress = (e) => {
    if (e.key == "Enter") {
      e.preventDefault();
    }
  }
  const handleEnter = (e) => {
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
  }, [userTags, questions]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    data.delete('user-tags')
    data.append('tags', userTags)
    data.append('questions', JSON.stringify(questions))
    const date = dateRef.current
    data.append('due_date',dayjs(date).format(format))
    await fetch('http://localhost:5000/setassignment', {
      method: 'POST',
      body: data,
      headers: new Headers({
        'Authorization': 'Bearer ' + token
      })
    }).then(res => res.json().then(data => {
      alert(data['success'])
      window.location.href = '/assignment/'+data['test_id'];
    }
    ))
  }
  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
        }}
      >
        <Typography component="h1" variant="h5">
          Assigment
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="title"
            label="Title"
            name="title"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            multiline
            minRows={3}
            name="description"
            label="Description"
            id="description"
          />
          {questions.length > 0 && 
          <>
          <Box sx={{ display: 'flex', alignContent: 'center', justifyContent:'center',flexDirection:'column',alignItems:'start'}}>
          <Typography variant='h6'>Questions</Typography>
          <List sx={{ width: '100%', maxWidth: '40%', bgcolor: 'background.paper',borderRadius:'15px'}}>
            {questions.map((data, idx) => {
              return (
                <Fragment key={idx}>
                <ListItem alignItems="flex-start" 

                  onClick={() => {
                    questionRef.current.value = data['question']
                    answerRef.current.value = data['answer']
                  }}


                  secondaryAction={
                    <IconButton edge="end" aria-label="comments" onClick={() => { removeItem(idx) }} >
                      <DeleteIcon  />
                    </IconButton>
                  }
                
                >
                  <ListItemText
                    primary={`${idx + 1}. ${data['question']}`}
                    secondary={
                      <React.Fragment>
                        <Typography
                          sx={{ display: 'inline' }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {data['answer']}
                        </Typography>

                      </React.Fragment>
                    }
                  />
                </ListItem>
                 {idx+1!=questions.length && <Divider  component="li" key={idx+"div"}/>}
                </Fragment>
              )
            })}

          </List>
          </Box></>}
          <TextField
            margin="normal"
            fullWidth
            id="question"
            label="Question"
            name="question"
            onKeyPress={handleQuestionKeyPress}
            onChange={(e) => { questionForm.current = e.target.value }}
            inputRef={questionRef}
          />


          <TextField
            margin="normal"
            fullWidth
            id="answer"
            label="Answer"
            name="answer"
            onKeyPress={handleAnswerKeyPress}
            onChange={(e) => { answerForm.current = e.target.value }}
            inputRef={answerRef}
          />

          <Card elevation={0}>{userTags.map((data, i) =>
            <Chip key={i} label={data} onClick={() => { handleChipClick(i) }} sx={{ margin: 1 }} />)}</Card>



          <TextField
            margin="normal"
            name="user-tags"
            label="User tags"
            id="user-tags"
            onKeyPress={handleEnter}
          />
          <br />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker label="Due date " name="due_date" onChange={(newValue) => { dateRef.current = newValue }} 
                format="YYYY-MM-DD"
              minDate={dayjs()}
/>
          </LocalizationProvider>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Set Assignment
          </Button>
        </Box>
      </Box>
    </Container>)
}

export default SetAssignment
