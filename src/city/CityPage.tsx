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
                <h1> 🌎 Air Quality Tracker </h1>
                <h2>{cityName}</h2>
                <p>Searching for PM2.5 data…</p>
            </div>
        );
    }
    
    if (airQuality == null || airQuality.pm25 == null) {
        return(
            <div>
                <h1> 🌎 Air Quality Tracker </h1>
                <h2> {cityName} </h2>
                <h3> No PM2.5 data </h3>
            </div>
        )
    }

    const aq: AirQualityData = airQuality;

    return (
        <CityCard data={aq} cityName={cityName}></CityCard>
        // <div>
        //     <h1> 🌎 Air Quality Tracker </h1>
        //     <h2> {cityName} </h2>
        //     <p> {airQuality.pm25} ug/m^3</p>
        //     <p> PM2.5 </p>
        //     <p> Monitor Location </p>
        //     <p> {airQuality.locationName} </p>
        //     <p> Last Updated </p>
        //     <p> {airQuality.lastUpdated} </p>
        // </div>
    );
};

export default CityPage;