import React, { useState } from "react";
import ReactMapGL, {
  Marker,
  Source,
  Layer,
  GeolocateControl
} from "react-map-gl";
import { Button } from "reactstrap";
import location from "./../../assets/location.png";
import Geocoder from "react-map-gl-geocoder";
import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useCurrentLocationContext } from "../../contexts/current-location-context";

const Controls = styled.div`
  display: grid;
  grid-template-columns: 50px 1fr;
  grid-gap: 10px;
  margin: 20px auto;
  width: 90%;
`;

const Map = () => {
  const {
    currentLocation: { latitude: initialLat, longitude: initialLng },
    setCurrentLocation
  } = useCurrentLocationContext();
  const [viewport, setViewPort] = useState({
    width: "450px",
    height: "100vh",
    latitude: initialLat,
    longitude: initialLng,
    zoom: 12
  });

  const mapRef = React.useRef();
  const geoCoderContainerRef = React.useRef();
  const _onViewportChange = viewport => {
    setViewPort({ ...viewport });
  };
  const _onGeoCoderViewportChange = viewport => {
    const geocoderDefaultOverrides = { transitionDuration: 1000 };

    return _onViewportChange({
      ...viewport,
      ...geocoderDefaultOverrides
    });
  };

  const handleOnResult = event => {
    console.log(event);
  };

  return (
    <div style={{ margin: "0 auto" }}>
      <ReactMapGL
        ref={mapRef}
        {...viewport}
        mapboxApiAccessToken={
          "pk.eyJ1Ijoic2h1YmgyOCIsImEiOiJjazhidHQ1Z2QwZm11M2lxcGd0Y21uMnR4In0.pkJ2tMkAcfeI6PC7gHIIwQ"
        }
        mapStyle="mapbox://styles/mapbox/streets-v11"
        onViewportChange={_onViewportChange}
        style={{ margin: "0 auto" }}
      >
        <Controls>
          <GeolocateControl
            positionOptions={{ enableHighAccuracy: true }}
            trackUserLocation={true}
            style={{ height: "50px", padding: "10px" }}
            showUserLocation={true}
          />
          <div
            ref={geoCoderContainerRef}
            style={{
              height: "50px"
            }}
          />
        </Controls>
        <Geocoder
          mapRef={mapRef}
          containerRef={geoCoderContainerRef}
          onResult={handleOnResult}
          onViewportChange={_onGeoCoderViewportChange}
          mapboxApiAccessToken={
            "pk.eyJ1Ijoic2h1YmgyOCIsImEiOiJjazhidHQ1Z2QwZm11M2lxcGd0Y21uMnR4In0.pkJ2tMkAcfeI6PC7gHIIwQ"
          }
          position="top-right"
          mar
        />
        {/* <DeckGL {...viewport} layers={[searchResultLayer]} /> */}

        <Source type="geojson">
          <Layer />
        </Source>
        <Marker
          longitude={viewport.longitude}
          latitude={viewport.latitude}
          offsetLeft={-8}
          offsetTop={-38}
        >
          <img
            src={location}
            alt="mark"
            height="50px"
            // onClick={() => onClick(store)}
          />
        </Marker>

        <Link to={`/stores?lat=${viewport.latitude}&lng=${viewport.longitude}`}>
          <Button
            style={{
              position: "absolute",
              left: "50%",
              bottom: 30,
              transform: "translateX(-50%)"
            }}
            onClick={() =>
              setCurrentLocation({
                latitude: viewport.latitude,
                longitude: viewport.longitude
              })
            }
          >
            {" "}
            Locate Stores{" "}
          </Button>
        </Link>
      </ReactMapGL>
    </div>
  );
};

export default Map;
