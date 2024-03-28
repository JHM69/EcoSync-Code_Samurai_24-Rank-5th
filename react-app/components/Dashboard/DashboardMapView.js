import React, { useState, useEffect } from 'react'
import GoogleMapReact from 'google-map-react'
import StsMarker from '../markers/StsMarker'
import VehicleMarker from '../markers/VehicleMarker'
import LandfillMarker from '../markers/LandfillMarker'
import { NoSSR } from '../common/NoSSR'

export default function StsVehiclesLandfillsMapView ({ stss, vehicles, landfills }) {
  const [geoJsonData, setGeoJsonData] = useState(null)
  const [infoWindow, setInfoWindow] = useState(null)

  // Dynamically load the GeoJSON file on component mount
  useEffect(() => {
    import('../common/dncc.json')
      .then((data) => {
        setGeoJsonData(data.default)
      })
      .catch((error) => console.log('Failed to load GeoJSON data:', error))
  }, []) // Empty dependency array means this effect runs once on mount

  const defaultProps = {
    center: {
      lat: 23.8103,
      lng: 90.4125
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
  return (
    <NoSSR>
    <div style={{ height: '500px', width: '100%', borderRadius: '10px' }}>
       {
        (stss || vehicles || landfills) && (
          <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyCePkfLfau3i98g4UC4AnOvt5Qnc-5DCHI' }} // Replace 'YOUR_API_KEY' with your Google Maps API key
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
          yesIWantToUseGoogleMapApiInternals
           onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
        >
          {/* load all stss, vehicles, landfills */}
          {landfills && landfills.map((landfill) => (
            <LandfillMarker
              key={landfill.lat + landfill.name}
              lat={landfill.lat}
              lng={landfill.lon}
              text={landfill.name}
              icon={landfill.icon}
            />
          ))}

          {stss && stss.map((sts, id) => (
            <StsMarker
              key={sts.lon + sts.wardNumber}
              lat={sts.lat}
              lng={sts.lon}
              text={sts.wardNumber}
              icon={sts.icon}
            />
          ))}
          {vehicles && vehicles.map((vehicle, id) => (
            <VehicleMarker
              key={vehicle.lat + vehicle.registrationNumber}
              lat={vehicle.lat}
              lng={vehicle.lon}
              text={vehicle.registrationNumber}
              icon={vehicle.icon}
            />
          ))}

        </GoogleMapReact>
        )
       }
    </div>
    </NoSSR>
  )
}
