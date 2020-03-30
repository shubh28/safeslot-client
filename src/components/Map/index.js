import React, { PureComponent, useState } from "react";
import ReactMapGL, { Marker, Source, Layer, Popup } from "react-map-gl";
import { Button } from "reactstrap";
import location from "./../../assets/location.png";



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

const Map = ({stores}) => {
  const [viewport, setViewPort] = useState({
    width: "100%",
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
        <Markers data={stores} onClick={onMarkerClick} />
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
        )}
      </ReactMapGL>
    </div>
  );
};

export default Map;
