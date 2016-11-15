import React, { Component, PropTypes } from 'react'
require('../style/header.css')

export default class Header extends Component {
  render() {
    const { city, region} = this.props
    return (
        <div id="header">
            <div id="locale" className="">
                <div className="city">
                    <h1>{city}</h1>
                </div>
                <div className="region">
                    <h3>{region === 'ALL' ? `${region} NEIGHBORHOODS` : region}</h3>
                </div>
            </div>
        </div>
        )
  }
}

Header.propTypes = {
  city: PropTypes.string,
  region: PropTypes.string,
}
