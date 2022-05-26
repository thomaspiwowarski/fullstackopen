import phonebookService from "../services/phonebook";

const Person = ({ person, setPersons, persons }) => {
  const deletePerson = (id) => {
    if (!window.confirm(`Delete ${person.name}?`)) return;
    phonebookService
      .deleteUser(id)
      .then(() => setPersons(persons.filter((person) => person.id !== id)));
  };
  return (
    <li>
      <p>
        {person.name} {person.number}
      </p>
      <button onClick={() => deletePerson(person.id)}>delete</button>
    </li>
  );
};

const Persons = ({ personsToShow, persons, setPersons }) => {
  return (
    <ul>
      {personsToShow.map((person) => (
        <Person key={person.number} {...{ person, persons, setPersons }} />
      ))}
    </ul>
  );
};

export default Persons;
