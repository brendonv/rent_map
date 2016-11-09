import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { toggleType, selectRegion, selectCity } from '../actions'
import MapContainer from './MapContainer'
import Header from '../components/Header'

class App extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleRefreshClick = this.handleRefreshClick.bind(this)
  }

  componentDidMount() {
    console.log("App.js Container :: componentDidMount")
    // const { dispatch, selectedReddit } = this.props
    // dispatch(fetchPostsIfNeeded(selectedReddit))
  }

  componentWillReceiveProps(nextProps) {
    console.log("App.js Container :: componentWillReceiveProps")
    // if (nextProps.selectedReddit !== this.props.selectedReddit) {
    //   const { dispatch, selectedReddit } = nextProps
    //   dispatch(fetchPostsIfNeeded(selectedReddit))
    // }
  }

  handleChange(nextReddit) {
    // this.props.dispatch(selectReddit(nextReddit))
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
      <div>
        <MapContainer city={selectedCity}
        />
        <Header city={selectedCity}
                region={selectedRegion} />
      </div>
    )
  }
}

App.propTypes = {
  selectedCity: PropTypes.string.isRequired,
  selectedRegion: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
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

          selectedRegion,
    selectedCity,
    dataByRegion,
    regionsByCity,
    togglePropertyType
  
  const { isFetching,
          lastUpdated,
          data: data } = dataByRegion[selectedRegion] || { isFetching: true,
                                                              data: [] }

  return {
    selectedCity,
    selectedRegion,
    data,
    isFetching,
    lastUpdated
  }
}

export default connect(mapStateToProps)(App)
