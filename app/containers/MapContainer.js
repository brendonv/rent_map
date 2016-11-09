import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { API } from '../constants/config'
import Map from '../components/Map'

class MapContainer extends Component {
    
    constructor(props) {
        super(props)
        this.handleClick.bind(this)
        this.state = {
            geo: undefined
        }
    }

    componentDidMount() {
        console.log("MAP CONTAINER :: COMPONENT DID MOUNT")
        //dispatch(someActionToGetGeoJSON()) //TODO: refactor to use redux
        fetch(`${API}/topology/${this.props.city.toLowerCase()}.geo.json`)
            .then(response => response.json())
            .then(json =>
                this.setState({
                    geo: json
                })
            )
    }

    handleClick(e) {
        console.log("CLICK")
    }

    render() {
        const { city } = this.props

        if (!this.state.geo) return null

        return (
            <Map json={this.state.geo}
                  height={1160}
                  width={960}/>
        )
    }
}

MapContainer.propTypes = {
    city: PropTypes.string
}

function mapStateToProps(state) {
    return {
        regions: state.selectedCity
    }
}

export default connect(mapStateToProps)(MapContainer)
