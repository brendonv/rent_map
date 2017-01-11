import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { toggleType, selectRegion, selectCity, fetchRegionDataIfNeeded } from '../actions'
import MapContainer from './MapContainer'
import Header from '../components/Header'
import DataResults from '../components/DataResults'

class App extends Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.handleRefreshClick = this.handleRefreshClick.bind(this)
  }

  componentDidMount() {
    console.log("App.js Container :: componentDidMount")
    //Kick-off intial data request
    const { dispatch, selectedCity, selectedRegion } = this.props
    dispatch(fetchRegionDataIfNeeded(selectedCity, selectedRegion))
  }

  //Here is where we listen for the base actions and dispatch the fetch action
  componentWillReceiveProps(nextProps) {
    console.log("App.js Container :: componentWillReceiveProps", nextProps.selectedRegion, this.props.selectedRegion)
    //Only call update if different region
    if (nextProps.selectedRegion !== this.props.selectedRegion) {
      const { dispatch, selectedCity, selectedRegion } = nextProps
      dispatch(fetchRegionDataIfNeeded(selectedCity, selectedRegion))
    }
  }

  handleClick(nextRegion) {
    // this.props.dispatch(selectReddit(nextReddit))
    console.log("#####", nextRegion);
    this.props.dispatch(fetchRegionDataIfNeeded(this.props.selectedCity, nextRegion))
  }

  handleRefreshClick(e) {
    e.preventDefault()

    // const { dispatch, selectedReddit } = this.props
    // dispatch(invalidateReddit(selectedReddit))
    // dispatch(fetchPostsIfNeeded(selectedReddit))
  }

  render() {
    console.log("App.js Container :: render()")
    const { selectedCity, selectedRegion, data, isFetching, lastUpdated } = this.props
    return (
      <div className="container">
        <div className="row">
          <div className="two-thirds column">
            <MapContainer city={selectedCity} 
                          onClick={this.handleClick}/>
          </div>
          <div className="one-third column">
            <Header city={selectedCity}
                    region={selectedRegion} />
            <DataResults isFetching={isFetching}
                         selectedCity={selectedCity}
                         selectedRegion={selectedRegion}
                         data={data}/>
          </div>
        </div>
      </div>
    )
  }
}

App.propTypes = {
  selectedCity: PropTypes.string.isRequired,
  selectedRegion: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired,
  lastUpdated: PropTypes.number,
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  const { selectedCity,
          selectedRegion,
          dataByRegion,
          regionsByCity,
          togglePropertyType } = state
  
  const { isFetching,
          lastUpdated,
          data: data } = dataByRegion[selectedRegion] || { isFetching: true,
                                                              data: {} }

  return {
    selectedCity,
    selectedRegion,
    data,
    isFetching,
    lastUpdated
  }
}

export default connect(mapStateToProps)(App)
