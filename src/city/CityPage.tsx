import { searchCities } from 'C:/Users/Owner/Desktop/Hack4Impact/SiennaRaderGowda-h4i-assessment-Spring26/src/api/geocoding'; 
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { fetchAirQualityByCoordinates } from '../api/openaqi';
import { useState, useEffect } from "react";
import { LocationSearchResponse, AirQualityData } from "../types";
import { useRef } from "react";
import CityCard from "./CityCard";

export const fetchPossibleCities = async(name: string) => {
    const results = await searchCities(name);
    // Returns array of cities with: name, displayName, lat, lng, country
    return results;
};

const CityPage = () => {
    const returnToHome = () => {
        navigate('/');
    }

    const location = useLocation();
    const navigate = useNavigate();
    const [airQuality, setAirQuality] = useState<AirQualityData | null> (null);
    const [hasFetched, setHasFetched] = useState(false);

    if (location.state == null) {
        navigate('/');
        return null;
    }

    const cityName = location.state.city.name;
    const cityLat = location.state.city.lat;
    const cityLong = location.state.city.lng;
    const hasRef = useRef(false);
    
    // GOAL: pass the city lat and lngs to fetchAirQualityByCoords and then get the PM2.5 measurement from the return
    useEffect(() => {
        if (hasRef.current) return;
        hasRef.current = true;
        const getData = async() => {
        const data = await fetchAirQualityByCoordinates(cityLat, cityLong);
        // check if data is null using the strictly == operator
        if (data !== null) {
            setAirQuality(data);
        }
        setHasFetched(true);
        }
        getData();
    }, [cityLat, cityLong]);

    if (!hasFetched) {
        return (
            <div>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px'}}>
                    <div style={{ flex: '0 0 auto' }}><button type="button" onClick={returnToHome} style={{padding: '10px 20px'}}> ← Back to Search </button> </div> 
                    <div style={{ flex: '1 1 auto', textAlign: 'center' }}><h1 style={{fontSize:'40px', color:'white'}}> 🌎 Air Quality Tracker </h1></div>
                </div>     
                <div>
                    <h2>{cityName}</h2>
                    <p>Searching for PM2.5 data… </p>
                </div>
            </div>
        );
    }
    
    if (airQuality == null || airQuality.pm25 == null) {
        return(
            <div>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px'}}>
                    <div style={{ flex: '0 0 auto' }}><button type="button" onClick={returnToHome} style={{padding: '10px 20px'}}> ← Back to Search </button> </div> 
                    <div style={{ flex: '1 1 auto', textAlign: 'center' }}><h1 style={{margin:'0', fontSize:'40px', color:'white'}}> 🌎 Air Quality Tracker </h1></div>
                </div>       
                <div>
                    <h2> {cityName} </h2>
                    <h3> No PM2.5 data </h3>
                </div>
            </div>
        )
    }

    const aq = airQuality;

    return (
        <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px'}}>
                <div style={{ flex: '0 0 auto' }}><button type="button" onClick={returnToHome} style={{padding: '10px 20px'}}> ← Back to Search </button> </div> 
                <div style={{ flex: '1 1 auto', textAlign: 'center' }}><h1 style={{fontSize:'40px', color:'white', margin: '0'}}> 🌎 Air Quality Tracker </h1></div>
            </div>     
            <div>
                <CityCard data={aq} cityName={cityName}></CityCard>
            </div>
        </div>
    );
};

export default CityPage;