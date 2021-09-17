import React from 'react';

import { Map, Marker, Popup, TileLayer } from 'react-leaflet';

// const position = [51.505, -0.09]
// function MyMap(){
// // const MyMap = (
//     return(
//     <Map center={position} zoom={13}>
//         <TileLayer
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
//         />
//         <Marker position={position}>
//             <Popup>A pretty CSS3 popup.<br />Easily customizable.</Popup>
//         </Marker>
//     </Map>
// );
// }

// const { Map: LeafletMap, TileLayer, Marker, Popup } = ReactLeaflet

class MyMap extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            lat: 51.505,
            lng: -0.09,
            zoom: 13
        }
    }

    componentDidMount(){
        this.setState({lat: this.props.lat, lng: this.props.lon});
    }

    render() {
        const position = [this.state.lat, this.state.lng];
        return (
            <Map center={position} zoom={this.state.zoom}>
                <TileLayer
                    url='https://{s}.tile.osm.org/{z}/{x}/{y}.png'
                />

                <Marker position={position}>
                    <Popup>
                        {/* A pretty CSS3 popup. <br /> Easily customizable. */}
                        {this.props.item}
                    </Popup>
                </Marker>
            </Map>
        );
    }
}
export default MyMap;
