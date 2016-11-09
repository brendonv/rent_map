import React, { Component, PropTypes } from 'react'

export default class Header extends Component {
  render() {
    const { city, region} = this.props
    return <div> {city} - {region} </div>
  }
}

Header.propTypes = {
  city: PropTypes.string,
  region: PropTypes.string,
}
