const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log(
    'Please provide the password as an argument: node mongo.js <password>'
  );
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstackopen:${password}@fullstackopen.xqyu19z.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);
if (process.argv.length > 3) {
  const name = process.argv[3];
  const number = process.argv[4];
  const newPerson = new Person({
    name,
    number,
  });

  newPerson.save().then((result) => {
    console.log(`added ${result.name} number ${result.number} to phonebook`);
    mongoose.connection.close();
  });
} else {
  Person.find({}).then((result) => {
    console.log('phonebook:');
    result.forEach(({ name, number }) => console.log(name, number));
    mongoose.connection.close();
  });
}
