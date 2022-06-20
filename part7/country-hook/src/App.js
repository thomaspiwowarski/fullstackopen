import { useState, useEffect } from "react";
import axios from "axios";

const useField = (type) => {
  const [value, setValue] = useState("");

  const onChange = (event) => {
    setValue(event.target.value);
  };

  return {
    type,
    value,
    onChange,
  };
};

const useCountry = (name) => {
  const [country, setCountry] = useState(null);

  useEffect(() => {
    async function getCountry() {
      if (!name) return;
      try {
        const response = await axios.get(
          `https://restcountries.com/v3.1/name/${name}`
        );
        setCountry({ found: true, ...response.data[0] });
      } catch (error) {
        setCountry({ found: false });
      }
    }
    getCountry();
  }, [name]);

  return country;
};

const Country = ({ country }) => {
  if (!country.found) {
    return <div>not found...</div>;
  }

  return (
    <div>
      <h3>{country.name.common}</h3>
      <div>population {country.population}</div>
      <div>capital {country.capital}</div>
      <img
        src={country.flags.png}
        height='100'
        alt={`flag of ${country.name.common}`}
      />
    </div>
  );
};

const App = () => {
  const nameInput = useField("text");
  const [name, setName] = useState("");
  const country = useCountry(name);

  const fetch = (e) => {
    e.preventDefault();
    setName(nameInput.value);
  };

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      {country ? <Country country={country} /> : null}
    </div>
  );
};

export default App;
