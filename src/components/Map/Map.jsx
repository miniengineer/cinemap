import React, { Component } from "react";
import {
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow
} from "react-google-maps";
import "../Map/Map.css";

const MyMap = withGoogleMap(props => (
  <GoogleMap
    className="googleMap"
    ref={props.onMapLoad}
    defaultZoom={12}
    defaultCenter={{ lat: 35.6762, lng: 139.6503 }}
    setCenter={props.center}
    onClick={() => {}}
  >
    {props.markers.map(marker => (
      <Marker
        key={marker.key}
        {...marker}
        onMouseOver={e => {
          props.onMarkerHover(marker.data, marker, e);
        }}
        onMouseOut={e => {
          props.onMarkerUnHover();
        }}
        onFocus={() => {}}
      />
    ))}
    {props.selectedPlace && (
      <InfoWindow
        className="infoWindow"
        position={props.position}
        marker={props.activeMarker}
        onClick={() => {}}
        visible={props.showingInfoWindow}
      >
        <div id="infoWindow">
          <h3>{props.selectedPlace.cinema.split("-").join(" ")}</h3>
          <p>{props.selectedPlace.address.display_text}</p>
          {props.selectedPlace.showtimes.map(showtime => (
            <h4 key={showtime}>{showtime}</h4>
          ))}
        </div>
      </InfoWindow>
    )}
  </GoogleMap>
));

class Map extends Component {
  constructor() {
    super();
    this.state = {
      showingInfoWindow: false,
      activeMarker: {},
      position: { lat: 39.8283, lng: -98.5795 },
      selectedPlace: ""
    };
  }

  onMarkerHover = (props, marker, e) => {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      position: marker.position,
      showingInfoWindow: true
    });
  };

  onMarkerUnHover = () => {
    this.setState({
      showingInfoWindow: false,
      selectedPlace: ""
    });
  };

  async componentDidMount() {
    console.log(
      this.props.locations.map(l => {
        return {
          position: {
            lat: l.location.lat,
            lng: l.location.lon
          },
          key: l.id
        };
      })
    );
  }

  render() {
    return process.env.npm_lifecycle_event === "test" ? (
      <div />
    ) : (
      <React.Fragment>
        <MyMap
          className="test"
          onMarkerHover={this.onMarkerHover}
          onMarkerUnHover={this.onMarkerUnHover}
          containerElement={
            <div
              className="mapContainer"
              style={{ height: `100%`, width: `100%`, borderRadius: "5px" }}
            />
          }
          mapElement={
            <div
              style={{ height: `70vh`, width: `100%`, borderRadius: "5px" }}
            />
          }
          scrollwheel={false}
          markers={this.props.locations.map(l => {
            return {
              position: {
                lat: l.location.lat,
                lng: l.location.lon
              },
              key: l.id,
              defaultAnimation: 2,
              data: {
                id: l.id,
                cinema: l.name,
                movie: "Joker",
                address: l.location.address,
                showtimes: ["10:30", "13:20", "16:40", "19:30"]
              }
            };
          })}
          getByState={this.props.getByState}
          position={this.state.position}
          visible={this.state.showingInfoWindow}
          selectedPlace={this.state.selectedPlace}
          center={this.props.position}
        />
      </React.Fragment>
    );
  }
}

export default Map;
