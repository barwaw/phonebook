require('dotenv').config()
const { response } = require('express')
const express = require('express')
const Person = require('./models/person')
// const morgan = require('morgan')
// const cors = require('cors')


// morgan.token('body', (req, res) => JSON.stringify(req.body))


const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if(error.name === 'CastError'){
    return response.status(400).send({error: 'malformed id'})
  } else if(error.name === 'ValidationError'){
    return response.status(400).send({error: error.message})
  }else{
    return response.status(400).send({error: error.message})
  }
  next(error)
}

const app = express()
app.use(express.json())
// app.use(morgan(':method :url :status :response-time :body'))
// app.use(cors)
app.use(express.static('build'))



app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if (person){
    response.json(person)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
  .then(result => {response.status(204).end()})
  .catch(error => next(error))
  // const id = Number(request.params.id)
  // persons = persons.filter(person => person.id !== id)
  // response.status(204).end()
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  const person = new Person({
    name: body.name,
    number: body.number
  })
  person.save()
  .then(savedPerson => response.json(savedPerson))
  .catch(error => next(error))

  // console.log(body)
  // if(!body.name || !body.number){
  //   return response.status(400).json({error: 'name or number missing'})
  // }
  // if(persons.find(person => person.name === body.name)){
  //   return response.status(400).json({error: 'name must be unique'})
  // }
  // const person = new Person({
  //   name: body.name,
  //   number: body.number
  // })
  // person.save().then(savedPerson => {
  //   response.json(savedPerson)
  // })
})

app.get('/info', (request, response) => {
  response.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${Date()}</p>`)
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, {new:true, runValidators: true, context: 'query'})
  .then(updatedPerson => {
    response.json(updatedPerson)
  })
  .catch(error => next(error))
})

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))