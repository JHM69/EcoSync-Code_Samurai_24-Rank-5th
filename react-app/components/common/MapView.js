import React, { useState, useEffect } from 'react'
import GoogleMapReact from 'google-map-react'
import Marker from '../markers/DefaultMarker'
import VehicleMarker from '../markers/VehicleMarker'

export default function MapView ({ lat, lon, name, address, height = '400px', width = '100%', borderRadius = '10px', vehicles = [] }) {
  const [geoJsonData, setGeoJsonData] = useState(null)
  const [infoWindow, setInfoWindow] = useState(null)

  // Dynamically load the GeoJSON file on component mount
  useEffect(() => {
    import('./dncc.json')
      .then((data) => {
        setGeoJsonData(data.default)
      })
      .catch((error) => console.log('Failed to load GeoJSON data:', error))
  }, []) // Empty dependency array means this effect runs once on mount

  const defaultProps = {
    center: {
      lat,
      lng: lon
    },
    zoom: 12

  }
  const handleApiLoaded = (map, maps) => {
    if (geoJsonData) {
      map.data.addGeoJson(geoJsonData)
      // Optional: Style your GeoJSON features
      map.data.setStyle({
        fillColor: 'yellow',
        strokeWeight: 1
      })

      // Close any existing info window when clicking on the map
      map.addListener('click', () => {
        if (infoWindow) {
          infoWindow.close()
        }
      })

      // Display an information window when a feature is clicked
      map.data.addListener('click', (event) => {
        // Extract the properties from the GeoJSON feature
        const ward = event.feature.getProperty('THA_UPA_NA')
        const wardName = event.feature.getProperty('UNI_WAR_NA')

        // Create content for the InfoWindow
        const contentString = `
          <div>
            <b> Ward : ${wardName}</b> 
            <p> Name : ${ward}</h3> 
          </div>
        `

        // Check if an infoWindow already exists
        if (!infoWindow) {
          const tempInfoWindow = new maps.InfoWindow({
            content: contentString,
            position: event.latLng
          })
          setInfoWindow(tempInfoWindow)
          tempInfoWindow.open(map)
        } else {
          infoWindow.setContent(contentString)
          infoWindow.setPosition(event.latLng)
          infoWindow.open(map)
        }
      })
    }
  }

  console.log(vehicles)
  return (
    <div style={{ height, width, borderRadius }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: 'AIzaSyCePkfLfau3i98g4UC4AnOvt5Qnc-5DCHI' }} // Replace 'YOUR_API_KEY' with your Google Maps API key
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
        yesIWantToUseGoogleMapApiInternals
         onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
      >
        <Marker lat={lat} lng={lon} text={name} address={address} />

        {
           vehicles && vehicles.map((vehicle) => (
            <VehicleMarker
              key={vehicle.id}
              lat={vehicle.lat}
              lng={vehicle.lon}
              text={vehicle.name}
              address={vehicle.address}
            />
           ))
        }
      </GoogleMapReact>
    </div>
  )
}
