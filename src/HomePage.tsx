import React, { useState} from 'react';
import { City } from "./types";
import { useNavigate } from 'react-router-dom';
import { searchCities } from '../src/api/geocoding'; 
import CityPage from './city/CityPage';
import './homePageStyle.css';

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
    if (value.length >= 1) {
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
        <h2 className="subtitle"> Search for any city to see PM2.5 air quality data </h2>
      </header>
      <input name="citySearchBox" type="text" value={inputText} onChange={handleChange} size={100} className="input" placeholder="Search for any city (e.g. Tokyo, Paris, New York)..."></input>
      {dropdown && inputCity.map((city, index) => (<div key={index} onClick = {() => {setText(city.name); setDropdown(false); changePage(city);}} style={{backgroundColor:'white', borderRadius:'10px', color:'black'}}> {city.name}, {city.country} </div>))}
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffff',
        color: '#666666',
        borderRadius: '15px',
        width: '735px',
        height: '100px',
        margin: '40px auto',
        padding: '20px',
        fontFamily: 'sans-serif',
      }}>
        <div style= {{color: '#667eea', fontWeight: 'bold'}}> Search for a city to get started </div>
        <p> Enter a city name above to see it's air quality data </p>
      </div>
    </div>
  );
};

export default HomePage;