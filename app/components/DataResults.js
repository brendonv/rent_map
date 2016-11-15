import React, { Component, PropTypes } from 'react'
require('../style/data.css')

export default class DataResults extends Component {
  render() {
    const { isFetching, city, region, data } = this.props

    const isEmpty = true
    return (
        <div id="data">
        {isFetching && <div>Loading...</div>
        }
        </div>
    )
  }
}

DataResults.propTypes = {
    isFetching: PropTypes.bool,
    city: PropTypes.string,
    region: PropTypes.string,
    data: PropTypes.object
}
