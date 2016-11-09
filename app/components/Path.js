import React, { Component, PropTypes } from 'react'

export default class Path extends Component {

    constructor(props) {
        super(props)
        this.state = {
            hovered: false
        }
        this.handleClick = this.handleClick.bind(this)
        this.onMouseOver = this.onMouseOver.bind(this)
        this.onMouseOut = this.onMouseOut.bind(this)
        this.style = this.style.bind(this)
    }

    handleClick() {
        console.log("CLIC")
    }

    style() {
      if (this.state.hovered) {
        return { fill: "red" }
      } else {
        return { fill: "#ddd" }
      }
    }

    onMouseOver() {
        this.setState({ hovered:true })
    }

    onMouseOut() {
        this.setState({ hovered:false })
    }

    render() {
        const { shape } = this.props
        return (
            <path className="outline"
                  onClick={this.handleClick}
                  onMouseOver={this.onMouseOver} 
                  onMouseOut={this.onMouseOut}
                  style={this.style()}
                  d={shape}>
            </path>
        )
    }

}

// Path.propTypes = {
//     shape: PropTypes.string.required
// }