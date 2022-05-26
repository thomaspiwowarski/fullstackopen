import axios from "axios";
import { useState, useEffect } from "react";

const CountryInList = ({ setCountryToShow, country }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <li key={country.name.common}>
      <p> {country.name.common}</p>
      <button onClick={() => setShowDetails(!showDetails)}>
        {showDetails ? "Hide" : "Show"}
      </button>
      {showDetails ? <SingleCountry country={country} /> : null}
    </li>
  );
};

const ManyCountries = ({ countries, setCountryToShow }) => {
  return (
    <>
      {countries.length > 10 ? (
        <div>Too many matches, specify another filter</div>
      ) : (
        <ul>
          {countries.map((country) => (
            <CountryInList
              key={country.name.common}
              {...{ setCountryToShow, country }}
            />
          ))}
        </ul>
      )}
    </>
  );
};

const SingleCountry = ({ country }) => {
  const [weather, setWeather] = useState("");
  const [icon, setIcon] = useState("");

  useEffect(() => {
    const api_key = process.env.REACT_APP_API_KEY;
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${country.capital[0]}&appid=${api_key}&units=metric`
      )
      .then((res) => {
        setWeather(res.data);
        setIcon(
          `http://openweathermap.org/img/wn/${res.data.weather[0].icon}@2x.png`
        );
        console.log(res.data);
      });
  }, [country.capital]);

  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>Capital: {country.capital[0]}</p>
      <p>Area: {country.area}</p>
      <p>Languages:</p>
      <ul>
        {Object.values(country.languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt='Flag' />
      <h2>Weather in {country.capital[0]}</h2>
      <p>Temperature: {weather?.main?.temp}C</p>
      <img src={icon} alt='Ikona pogody' />
      <p>Wind: {weather?.wind?.speed}m/s</p>
    </div>
  );
};

const Countries = ({ countries }) => {
  return (
    <>
      {countries.length === 1 ? (
        <SingleCountry country={countries[0]} />
      ) : (
        <ManyCountries countries={countries} />
      )}
    </>
  );
};

const Filter = ({ filter, setFilter }) => {
  const handler = (e) => {
    const name = e.target.value.toLowerCase();
    setFilter(name);
  };

  return <input value={filter} onChange={handler} />;
};

function App() {
  const [filter, setFilter] = useState("");
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all").then((res) => {
      setCountries(res.data);
    });
  }, []);

  const countriesToShow = countries.filter((country) =>
    country.name.common.toLowerCase().includes(filter)
  );

  return (
    <div className='App'>
      <Filter {...{ filter, setFilter }} />
      {countries.length ? <Countries countries={countriesToShow} /> : null}
    </div>
  );
}

export default App;
