import { AirQualityData, LatestMeasurementResponse, LocationSearchResponse } from "../types";

const API_KEY = "03eb00e771b25f02858f76479cff4c98e0fc1054de7b15ca8ea20a2916ea25c0";
const BASE_URL = "/api";
import { searchCities } from './geocoding'; 

//create the bounding box for a certain radius
export const createBoundingBox = (latitude: number, longitude: number, radius: number) => {
    // convert to degrees for lat and longitutde
    const latDegrees = radius / 111;
    const lngDegrees = radius / (111 * Math.cos(latitude * Math.PI / 180));
    const minLng = longitude - lngDegrees;
    const maxLng =  longitude + lngDegrees;
    const minLat = latitude - latDegrees;
    const maxLat = latitude + latDegrees;
 
    return {
        minLng,
        maxLng,
        minLat,
        maxLat
    }
}

// Main function that searches by coordinates <---- checks, using the latitude and longitude from a given country, for the nearest updated PM2.5 monitoring station 
// and then grabs the data from there and returns the data in a card
export const fetchAirQualityByCoordinates = async(latitutde: number, longitude: number): Promise<AirQualityData | null> => {
    try {
        // Step 1: Search for nearby PM2.5 monitors using bounding box
        const bounding_box = createBoundingBox(latitutde, longitude, 50);
        const apiUrl = `https://api.openaq.org/v3/locations?bbox=${bounding_box.minLng},${bounding_box.minLat},${bounding_box.maxLng},${bounding_box.maxLat}&parameter=pm25&limit=100`;
        const proxiedUrl = `https://corsproxy.io/?${encodeURIComponent(apiUrl)}`;
        const response = await fetch(proxiedUrl, {method: 'GET', headers : {'X-API-Key': "03eb00e771b25f02858f76479cff4c98e0fc1054de7b15ca8ea20a2916ea25c0", 'Accept': 'application/json'}})
        
        const responseData: LocationSearchResponse = await response.json();
        if (responseData.results == null || responseData.results.length == 0){
            return null;
        }

        const pm25Stations = responseData.results.filter(station => station.sensors?.some(sensor => sensor.parameter.name == 'pm25'));
        if (pm25Stations.length == 0) {
            return null;
        }

        // Step 2: Find the most recently active location
        const nearest = pm25Stations.reduce((closest: any, station ) => {
            const distance = Math.sqrt(Math.pow(latitutde - station.coordinates.latitude, 2) + Math.pow(longitude - station.coordinates.longitude, 2)); 
            if (closest == null || distance < closest.distance) {
                return {station, distance};
            }
            return closest;
        }, null);

        if (nearest == null) {
            return nearest;
        }

        // Find PM2.5 sensor
        const finalStation = nearest.station;
        const specificSensor = finalStation.sensors.find((sensor: LocationSearchResponse['results'][0]['sensors'][0]) => sensor.parameter.name == 'pm25');
        if (specificSensor == null) {
            return null;
        }

        const measurementUrl = `https://api.openaq.org/v3/sensors/${specificSensor.id}`;
        const proxiedMeasurementUrl = `https://corsproxy.io/?${encodeURIComponent(measurementUrl)}`;

        // Step 3: Get latest measurements
        const measurementData = await fetch(proxiedMeasurementUrl, {method: 'GET', headers: {'X-API-Key': '03eb00e771b25f02858f76479cff4c98e0fc1054de7b15ca8ea20a2916ea25c0', 'Accept': 'application/json'}})
        const measurement: LatestMeasurementResponse = await measurementData.json();
        if (measurementData == null || measurement.results.length == 0) {
            return null;
        }

        // Match measurement to PM2.5 sensor by sensorsId
        const sensorData = measurement.results[0] as any;
        if (!sensorData?.latest?.value) {
            return null;
        }

        return {
            locationName: finalStation.name,
            pm25: sensorData.latest.value,
            unit: specificSensor.parameter.units,
            lastUpdated: sensorData.latest.datetime.local
        }
        
    } catch (error) {
        // if there are any errors return null
        return null;
    }
};

export const fetchAirQuality = fetchAirQualityByCoordinates;