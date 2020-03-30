import React, { PureComponent, useState } from "react";
import ReactMapGL, {
  Marker,
  Source,
  Layer,
  Popup,
  GeolocateControl
} from "react-map-gl";
import { Button } from "reactstrap";
import location from "./../../assets/location.png";
import Geocoder from "react-map-gl-geocoder";
import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import styled from "styled-components";
import {Link} from 'react-router-dom'

// class Markers extends PureComponent {
//   render() {
//     const { data, onClick } = this.props;
//     return data.map(store => (
//       <>
//         <Marker
//           key={store.id}
//           longitude={store.longitude}
//           latitude={store.latitude}
//         >
//           <img
//             src={location}
//             alt="mark"
//             height="50px"
//             onClick={() => onClick(store)}
//           />
//         </Marker>
//       </>
//     ));
//   }
// }

const Controls = styled.div`
  display: grid;
  grid-template-columns: 50px 1fr;
  grid-gap: 5%;
  margin: 20px 10px;
`;
const Map = () => {
  const [viewport, setViewPort] = useState({
    width: "100vw",
    height: "90vh",
    latitude: 28.69999999999997,
    longitude: 77.19999999999999,
    zoom: 12
  });

  const [selectedLocation, setSelectedLocation] = useState();
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
    <div style={{ margin: "0 auto 40px auto" }}>
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
              height: 50
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

        <Link
          to={`/stores?lat=${viewport.latitude}&long=${viewport.longitude}`}
        >
          <Button
            onClick={() =>
              setSelectedLocation({
                lat: viewport.latitude,
                long: viewport.longitude
              })
            }
            style={{
              position: "absolute",
              left: "50%",
              bottom: 30,
              transform: "translateX(-50%)"
            }}
          >
            {" "}
            Locate Stores{" "}
          </Button>
        </Link>
        {/* <Markers data={stores} onClick={onMarkerClick} />
        {selectedStore && (
          <Popup
            tipSize={5}
            anchor="top"
            longitude={selectedStore.longitude}
            latitude={selectedStore.latitude}
            closeOnClick={false}
            onClose={() => setSelectedStore(undefined)}
            style={{ maxWidth: "200px", padding: "10px" }}
            offsetLeft={17}
            offsetTop={20}
          >
            <div>
              <strong>{selectedStore.name}</strong>
              <p>{selectedStore.address}</p>
              <Button outline color="info" onClick={() => this.toggleModal()}>
                Book Slot
              </Button>
            </div>
          </Popup>
        )} */}
      </ReactMapGL>

      
      {/* {selectedLocation && (
        <div>
          {" "}
          {`lat: ${selectedLocation.latitude} long: ${selectedLocation.longitude}`}{" "}
        </div>
      )} */}
    </div>
  );
};

export default Map;
