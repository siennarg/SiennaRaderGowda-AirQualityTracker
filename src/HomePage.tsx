import React, { useState} from 'react';
import { City } from "./types";
import { useNavigate } from 'react-router-dom';
import { searchCities } from '../src/api/geocoding'; 
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CityPage from './city/CityPage';

const HomePage = () => {
  // declare all the variables
  const [inputText, setText] = useState('');
  const [dropdown, setDropdown] = useState(false);
  const [inputCity, setInputCity] = useState<City[]>([]);
  const navigate = useNavigate();

  const handleChange = async(event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // set the text with the value in the box
    setText(value);
    // check the length of the input and the show the dropdown
    if (value.length > 2) {
      const possibleCities = await searchCities(value);
      setInputCity(possibleCities);
      setDropdown(true);
    } else {
      setInputCity([]);
      setDropdown(false);
    }
  }

  // change the page 
  const changePage = (city : City) => {
    navigate('/CityPage', {state: {city} });
  }

  return (
    <div>
      <header>
        <h1>🌎 Air Quality Tracker</h1>
        <h2> Search for any city to see PM2.5 air quality data </h2>
        <h3> Enter a city name above to see it's air quality data </h3>
      </header>
      <input name="citySearchBox" type="text" value={inputText} onChange={handleChange} minLength={500} placeholder="Search for any city (e.g. Tokyo, Paris, New York)..."></input>
      {dropdown && inputCity.map((city, index) => (<div key={index} onClick = {() => {setText(city.name); setDropdown(false); changePage(city);}} > {city.name}, {city.country} </div>))}
    </div>
  );
};

export default HomePage;