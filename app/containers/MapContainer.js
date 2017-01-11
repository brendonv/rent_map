import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { API } from '../constants/config'
import Map from '../components/Map'
import Label from '../components/Label'

var customMapStyle = [
    {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "saturation": 36
            },
            {
                "color": "#333333"
            },
            {
                "lightness": 40
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#ffffff"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#fefefe"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#fefefe"
            },
            {
                "lightness": 17
            },
            {
                "weight": 1.2
            }
        ]
    },
    {
        "featureType": "administrative.neighborhood",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f5f5f5"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f5f5f5"
            },
            {
                "lightness": 21
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#dedede"
            },
            {
                "lightness": 21
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                // "color": "#ffffff"
                "color": "#f99c00"
            },
            {
                // "lightness": 17
                "lightness": "49"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "lightness": 29
            },
            {
                "weight": 0.2
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "lightness": 18
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f2f2f2"
            },
            {
                "lightness": 19
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#e9e9e9"
            },
            {
                "lightness": 17
            }
        ]
    }
];

class MapContainer extends Component {
    
    constructor(props) {
        super(props)
        this.setStyle = this.setStyle.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.handleRightClick = this.handleRightClick.bind(this)
        this.handleMouseOver = this.handleMouseOver.bind(this)
        this.handleMouseOut = this.handleMouseOut.bind(this)
        this.attachMap = this.attachMap.bind(this)
        this.state = {
            geo: undefined,
            map: undefined,
            lastHighlighted: undefined
        }
    }

    componentDidMount() {
        console.log("MAP CONTAINER :: COMPONENT DID MOUNT")
        //dispatch(someActionToGetGeoJSON()) //TODO: refactor to use redux
        fetch(`${API}/topology/${this.props.city.toLowerCase()}.geo.json`)
            .then(response => response.json())
            .then(json =>
                this.setState({
                    geo: topojson.feature(json, json.objects.neighborhoods_portland) //TODO: hard-coded variables
                })
            )
    }

    //Here is where we listen for changes in global state (via props) and dispatch actions/set local state accordingly
    componentWillReceiveProps(nextProps) {

    }

    setStyle(feature) {
        var color = 'gray';
        if (feature.getProperty('isHighlighted')) {
            color = 'green';
            // color = 'rgb(180,226,216)';
        }
        return ({
            fillColor: color,
            strokeColor: 'gray',
            strokeWeight: 2
        });
    }

    handleClick(event) {
        console.log("CLICK")
        this.state.map.data.revertStyle();
        if (this.state.lastHighlighted) this.state.lastHighlighted.setProperty('isHighlighted', false);
        event.feature.setProperty('isHighlighted', true);
        this.state.lastHighlighted = event.feature;

        //Trigger action in App.js container
        this.props.onClick(event.feature.getProperty("name"))
    }

    handleRightClick(event) {
        console.log("right click: ", event.feature.getProperty('name'))
    }

    handleMouseOver(event) {
        // console.log(event.feature.getGeometry().forEachLatLng( ll => console.log(ll.lat(), ll.lng())))
        if (event.feature.getProperty('isHighlighted')) {
            return;
        }
        this.state.map.data.revertStyle();
        this.state.map.data.overrideStyle(event.feature, {strokeWeight: 2, fillColor: 'blue'});
        this.setState({hover:true})
//         function TxtOverlay(pos, txt, cls, map) {

//           // Now initialize all properties.
//           this.pos = pos;
//           this.txt_ = txt;
//           this.cls_ = cls;
//           this.map_ = map;

//           // We define a property to hold the image's
//           // div. We'll actually create this div
//           // upon receipt of the add() method so we'll
//           // leave it null for now.
//           this.div_ = null;

//           // Explicitly call setMap() on this overlay
//           this.setMap(map);
//         }

//         TxtOverlay.prototype = new google.maps.OverlayView();



//         TxtOverlay.prototype.onAdd = function() {

//           // Note: an overlay's receipt of onAdd() indicates that
//           // the map's panes are now available for attaching
//           // the overlay to the map via the DOM.

//           // Create the DIV and set some basic attributes.
//           console.log("onadd")
//           var div = document.createElement('DIV');
//           div.className = this.cls_;

//           div.innerHTML = this.txt_;

//           // Set the overlay's div_ property to this DIV
//           this.div_ = div;
//           var overlayProjection = this.getProjection();
//           var position = overlayProjection.fromLatLngToDivPixel(this.pos);
//           div.style.left = position.x + 'px';
//           div.style.top = position.y + 'px';
//           // We add an overlay to a map via one of the map's panes.

//           var panes = this.getPanes();
//           panes.floatPane.appendChild(div);
//         }
//         TxtOverlay.prototype.draw = function() {
// console.log("draw")

//             var overlayProjection = this.getProjection();

//             // Retrieve the southwest and northeast coordinates of this overlay
//             // in latlngs and convert them to pixels coordinates.
//             // We'll use these coordinates to resize the DIV.
//             var position = overlayProjection.fromLatLngToDivPixel(this.pos);


//             var div = this.div_;
//             div.style.left = position.x + 'px';
//             div.style.top = position.y + 'px';



//           }
//           //Optional: helper methods for removing and toggling the text overlay.  
//         TxtOverlay.prototype.onRemove = function() {
//           this.div_.parentNode.removeChild(this.div_);
//           this.div_ = null;
//         }
//         TxtOverlay.prototype.hide = function() {
//           if (this.div_) {
//             this.div_.style.visibility = "hidden";
//           }
//         }

//         TxtOverlay.prototype.show = function() {
//           if (this.div_) {
//             this.div_.style.visibility = "visible";
//           }
//         }

//         TxtOverlay.prototype.toggle = function() {
//           if (this.div_) {
//             if (this.div_.style.visibility == "hidden") {
//               this.show();
//             } else {
//               this.hide();
//             }
//           }
//         }

//         TxtOverlay.prototype.toggleDOM = function() {
//           if (this.getMap()) {
//             this.setMap(null);
//           } else {
//             this.setMap(this.map_);
//           }
//         }
//         // var latlng = new google.maps.LatLng(45.5299507,-122.640964);
//         var txt = new TxtOverlay(event.latLng, "Sup", "customBox", this.state.map)

//         this.setState({ label: txt })
    }

    handleMouseOut(event) {
        this.state.map.data.revertStyle();
        // this.state.label.hide()
    }

    attachMap(node) {
        console.log("ATTACH NODE")

        if (this.state.map || node === null) {
            return;
        }
        const map = new google.maps.Map(node, { zoom: 12,
                                                center: new google.maps.LatLng(45.5299507,-122.640964),
                                                disableDefaultUI: true,
                                                zoomControl: true,
                                                styles: customMapStyle })

        map.data.addGeoJson(this.state.geo)

        map.data.setStyle(this.setStyle)

        map.data.addListener('click', this.handleClick)

        map.data.addListener('rightclick', this.handleRightClick)

        map.data.addListener('mouseover', this.handleMouseOver)

        map.data.addListener('mouseout', this.handleMouseOut)

        this.setState({ map })
    }

    render() {
        const { city } = this.props

        if (!this.state.geo) return null

        return (
            <div>
                <div id="map" ref={this.attachMap}>
                </div>
                {this.state.hover && <Label map={this.state.map}/>}
            </div>
        )
    }
}

MapContainer.propTypes = {
    city: PropTypes.string,
    onClick: PropTypes.func.isRequired
}

function mapStateToProps(state) {
    return {
        regions: state.selectedCity
    }
}

export default connect(mapStateToProps)(MapContainer)
