const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const url = process.env.MONGODB_URI;

mongoose
  .connect(url)
  .then((result) => {
    console.log('connected to MongoDB', result);
  })
  .catch((error) => {
    console.log('error connecting to MongoDB', error);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
    unique: true,
  },
  number: {
    type: String,
    minlength: 8,
    require: true,
    validate: {
      validator: function (v) {
        return /^[0-9]{2,3}-[0-9]{1,}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number`,
    },
  },
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

personSchema.plugin(uniqueValidator, { type: 'mongoose-unique-validator' });

module.exports = mongoose.model('Person', personSchema);
