import React from "react";
import { AirQualityData } from "../types";
import './CityCardStyle.css'

interface CityCardProps {
    data: AirQualityData;
    cityName: string;
}

const getAirQualityStatus = (pm25: number) => {
  if (pm25 <= 12) return { status: 'Good', color: '#28a745' };
  if (pm25 <= 35) return { status: 'Moderate', color: '#ffc107' };
  if (pm25 <= 55) return { status: 'Unhealthy', color: '#dc3545' };
  return { status: 'Very Unhealthy', color: '#8b2e9f' };
};

const CityCard: React.FC<CityCardProps> = ({ data, cityName }) => {
    if (data.pm25 == null) {
        return (<p>No pm2.5 data available</p>);
    }

    const { status, color } = getAirQualityStatus(data.pm25);

    return (
        <div style={{ 
            backgroundColor: '#ffff',
            maxWidth: '400px',
            margin: '0 auto',
            borderRadius: '15px',
            color: 'black',
            padding: '35px'
        }}> 
        <div style= {{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
        }}>
        <span style={{ color: '#333333', fontWeight: 'bold', fontSize: '22px' }}>
            {cityName}   
        </span>
        <span style={{ color: color, fontWeight: '600', fontSize: '20px' }}>
            {status}   
        </span>
        </div>

        <div style= {{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '16px',
            justifyContent: 'center'
        }}>
        <span style={{ color:'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', fontWeight: 'bold', fontSize: '55px', marginRight:'8px'}}>
            {data.pm25.toFixed(1)}   
        </span>
        <span style={{ color: '#666666', fontWeight: '400', fontSize: '20px'}}>
            {data.unit}   
        </span>
        </div>

        <div style={{ color: '#666666', fontSize: '15px'}}>PM2.5</div>
        <div style= {{
            textAlign: 'left',
        }}>
        <h4 className="label">Monitor Location</h4>
        <div className="locationData">{data.locationName}</div>
        <h4 className="label">Last Updated</h4>
        <div className="locationData">{data.lastUpdated}</div>
        </div>
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
