/*global google*/
import React, { Component } from "react";
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  DirectionsRenderer,
} from "react-google-maps";
import Geocode from "react-geocode";

Geocode.setApiKey("AIzaSyCTIuglr0yoyg7N3YinUj0xEeKmQCA8VT0");
Geocode.enableDebug();

class Map extends React.Component {
  state = {
    directions: [],
    destination: "",
    latOrigin: 0,
    lngOrigin: 0,
    latDestin: 0,
    lngDestin: 0,
    destinationAddress: "",
  };

  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    // this.setState({
    //   destinationAddress: this.state.destinationAddress,
    // });
    console.log(this.state.destinationAddress);
    this.geoDestiny();
  };

  geoDestiny = () => {
    Geocode.fromAddress(this.state.destinationAddress).then(
      (response) => {
        let { lat, lng } = response.results[0].geometry.location;
        this.setState({
          latDestin: lat,
          lngDestin: lng,
        });
        console.log(this.state.latDestin, this.state.lngDestin);
      },
      (error) => {
        console.error(error);
      }
    );
  };

  displayLocationInfo = (position) => {
    let lng2 = position.coords.longitude;
    let lat2 = position.coords.latitude;
    console.log(`longitude: ${lat2} | latitude: ${lng2}`);
    this.setState({
      latOrigin: lat2,
      lngOrigin: lng2,
    });
    console.log("disply" + this.state.lat);

    this.loadMap();
  };

  getpositon = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.displayLocationInfo);
    }
  };

  loadMap = () => {
    console.log(
      `origin lat: ${this.state.latOrigin}, lng: ${this.state.lngOrigin} `
    );
    console.log(
      `Destino lat:  ${this.state.latDestin}, lng: ${this.state.lngDestin} `
    );

    let origin = { lat: this.state.latOrigin, lng: this.state.lngOrigin };
    let destination = { lat: this.state.latDestin, lng: this.state.lngDestin };
    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.setState({
            directions: result,
          });
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  };

  componentDidMount = () => {
    console.log("component" + this.state.lat);
  };

  render() {
    const GoogleMapExample = withGoogleMap((props) => (
      <GoogleMap
        defaultCenter={{ lat: 40.756795, lng: -73.954298 }}
        defaultZoom={13}
      >
        <DirectionsRenderer directions={this.state.directions} />
      </GoogleMap>
    ));

    return (
      <div>
        {this.state.destinationAddress != "" ? (
          <GoogleMapExample
            containerElement={
              <div style={{ height: `500px`, width: "500px" }} />
            }
            mapElement={<div style={{ height: `100%` }} />}
          />
        ) : (
          ""
        )}

        <form onSubmit={this.handleSubmit}>
          <div>
            <lable htmlFor="description" className="col-sm-1 col-form-label">
              Destination Address:
            </lable>
            <div class="col-sm-11">
              <input
                type="text"
                required
                value={this.state.destinationAddress}
                className="form-control"
                id="destinationAddress"
                onChange={this.handleChange}
              />
            </div>
            <div class="col-sm-10">
              <button type="submit" class="btn btn-primary">
                Create{" "}
              </button>
            </div>
          </div>
        </form>
        <div>
          {this.state.directions.routes
            ? this.state.directions.routes[0].legs[0].steps.map((elemen) => (
                <div>
                  {" "}
                  <p
                    dangerouslySetInnerHTML={{ __html: elemen.instructions }}
                  />{" "}
                </div>
              ))
            : ""}
        </div>
      </div>
    );
  }
}

export default Map;
