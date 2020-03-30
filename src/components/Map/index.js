import React, { PureComponent, useState } from "react";
import ReactMapGL, { Marker, Source, Layer, Popup } from "react-map-gl";
import { Button } from "reactstrap";
import location from "./../../assets/location.png";

const STORES = [
  {
    id: "A",
    name: "Store A",
    address: "Address of Store A",
    locality: "Location of Store A",
    city: "CityA",
    latitude: 28.6536582,
    longitude: 77.4330673
  },
  {
    id: "B",
    name: "Store B",
    address: "Address of Store B",
    locality: "Location of Store B",
    city: "CityB",
    latitude: 28.6836404,
    longitude: 77.4394188
  },
  {
    id: "C",
    name: "Store C",
    address: "Address of Store C",
    locality: "Location of Store C",
    city: "CityC",
    latitude: 28.6705283,
    longitude: 77.4571214
  }
];

class Markers extends PureComponent {
  render() {
    const { data, onClick } = this.props;
    return data.map(store => (
      <>
        <Marker
          key={store.id}
          longitude={store.longitude}
          latitude={store.latitude}
        >
          <img
            src={location}
            alt="mark"
            height="50px"
            onClick={() => onClick(store)}
          />
        </Marker>
      </>
    ));
  }
}

const Map = () => {
  const [viewport, setViewPort] = useState({
    width: "95%",
    height: 400,
    latitude: 28.6705283,
    longitude: 77.4394188,
    zoom: 12
  });

  const [selectedStore, setSelectedStore] = useState();

  const _onViewportChange = viewport => setViewPort({ ...viewport });

  const onMarkerClick = store => {
    if (store) {
      setSelectedStore(store);
    }
  };
  const geolocateStyle = {
    float: "left",
    margin: "50px",
    padding: "10px"
  };
  return (
    <div style={{ margin: "0 auto" }}>
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={
          "pk.eyJ1Ijoic2h1YmgyOCIsImEiOiJjazhidHQ1Z2QwZm11M2lxcGd0Y21uMnR4In0.pkJ2tMkAcfeI6PC7gHIIwQ"
        }
        mapStyle="mapbox://styles/mapbox/streets-v11"
        onViewportChange={_onViewportChange}
        style={{ margin: "0 auto" }}
      >
        <Source type="geojson">
          <Layer />
        </Source>
        <Markers data={STORES} onClick={onMarkerClick} />
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
          >
            <div>
              <strong>{selectedStore.name}</strong>
              <p>{selectedStore.address}</p>
              <Button outline color="info" onClick={() => this.toggleModal()}>
                Book Slot
              </Button>
            </div>
          </Popup>
        )}
      </ReactMapGL>
    </div>
  );
};

export default Map;
