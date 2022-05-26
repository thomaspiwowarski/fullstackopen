import phonebookService from "./services/phonebook";
import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState(null);

  useEffect(() => {
    phonebookService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const personsToShow = !filter
    ? persons
    : persons.filter((person) =>
        person.name.toLowerCase().includes(filter.toLowerCase())
      );

  const showNotification = (content, error) => {
    setMessage({
      content,
      error,
    });
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  const addPerson = (e) => {
    e.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber,
    };

    const user = persons.filter(
      (person) => newName.toLowerCase() === person.name.toLowerCase()
    );

    if (user.length) {
      if (
        !window.confirm(
          `${newName} is already added to phonebook, replace the old number with new one?`
        )
      )
        return;

      phonebookService
        .update(user[0].id, personObject)
        .then((res) => {
          phonebookService.getAll().then((updatedPersons) => {
            setPersons(updatedPersons);
            showNotification(`Updated ${newName} number`, false);
          });
        })
        .catch((res) => {
          showNotification(
            `Information of ${newName} has already been deleted`,
            true
          );
          phonebookService.getAll().then((refresh) => setPersons(refresh));
        });
      return;
    }
    phonebookService
      .create(personObject)
      .then((res) => {
        setPersons(persons.concat(res));
        showNotification(`Added ${newName}`, false);
      })
      .catch((res) => {
        showNotification("There was a problem", true);
      });
    setNewName("");
    setNewNumber("");
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter {...{ filter, setFilter }} />
      <Notification message={message} />
      <h3>add a new</h3>
      <PersonForm
        {...{ newName, setNewName, newNumber, setNewNumber, addPerson }}
      />
      <h2>Numbers</h2>
      <Persons {...{ personsToShow, setPersons, persons }} />
    </div>
  );
};

export default App;
