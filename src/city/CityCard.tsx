import React from "react";
import { AirQualityData } from "../types";

interface CityCardProps {
    data: AirQualityData;
    cityName: string;
}

const getAirQualityStatus = (pm25: number) => {
  if (pm25 <= 12) return { status: 'Good', color: '#28a745' };
  if (pm25 <= 35.4) return { status: 'Moderate', color: '#ffc107' };
  if (pm25 <= 150.4) return { status: 'Unhealthy', color: '#dc3545' };
  if (pm25 <= 250.4) return { status: 'Very Unhealthy', color: '#8b2e9f' };
  return { status: 'Hazardous', color: '#7e0023' };
};

const CityCard: React.FC<CityCardProps> = ({ data, cityName }) => {
    if (data.pm25 == null) {
        return (<p>No pm2.5 data available</p>);
    }

    const { status, color } = getAirQualityStatus(data.pm25);

    return (
        <div style={{ 
            backgroundColor: '#ffff',
        }}>
        <h2> {cityName} </h2>
        <div style={{
            fontSize: '48px', 
            fontWeight: 'bold', 
            color: color,
            margin: '16px 0'
        }}>         {data.pm25.toFixed(1)} {data.unit}  </div>
        <p>{status}</p>

        </div>
    )
};

export default CityCard;





















// import { searchCities } from 'C:/Users/Owner/Desktop/Hack4Impact/SiennaRaderGowda-h4i-assessment-Spring26/src/api/geocoding'; 

// export const fetchPossibleCities = async(name: string) => {
//     const results = await searchCities(name);
//     // Returns array of cities with: name, displayName, lat, lng, country <-- this is actually OK since we are searching as we go
//     return results;
// };

// export const fetchAirQualityData = async(locationID: string) => {
    
//     const location = await fetch("https://api.openaq.org/v3/locations/8118")
// }
