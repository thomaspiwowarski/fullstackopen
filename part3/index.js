require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

const app = express();
app.use(cors());

app.use(express.json());
morgan.token('body', function (req) {
  return JSON.stringify(req.body);
});
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

app.use(express.static('build'));

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then((result) => {
      res.json(result);
    })
    .catch((error) => next(error));
});

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;
  Person.findById(id)
    .then((person) => {
      if (!person) res.status(404).end();
      res.json(person);
    })
    .catch((error) => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;
  Person.findByIdAndRemove(id)
    .then((result) => {
      console.log(result);
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body;
  console.log(req.body);
  if (!name || !name?.length)
    return res.status(400).json({ error: 'Name is missing' });
  if (!number || !number?.length)
    return res.status(400).json({ error: 'Number is missing' });
  // if (persons.find((person) => person.name === name))
  //   return res.status(400).json({ error: "Name must be unique" });

  const person = new Person({
    name,
    number,
  });

  person
    .save()
    .then((savedPerson) => res.json(savedPerson))
    .catch((error) => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;
  const { name, number } = req.body;

  const person = {
    name,
    number,
  };

  Person.findByIdAndUpdate(id, person, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.get('/info', (req, res, next) => {
  const date = new Date();
  Person.count({})
    .then((result) =>
      res.send(
        `<div><p>Phonebook has info for ${result} people</p><p>${date}</p></div>`
      )
    )
    .catch((error) => next(error));
});

const errorHandler = (error, req, res, next) => {
  console.error(error);

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
