import React, { Component, PropTypes } from 'react'
import Path from './Path'

export default class Map extends Component {

    handleClick() {
        console.log("CLIC")
    }
    
    render() {
        const { json, height, width } = this.props
        const counties = topojson.feature(json, json.objects.neighborhoods_portland); //TODO: find a better way to reference this

        let projection = d3.geo.mercator()
            .scale(1)
            .translate([0, 0]);

        // Create a path generator.
        const path = d3.geo.path()
            .projection(projection);

        let b = path.bounds(counties)
        let s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height)
        let t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2]

        projection
            .scale(s)
            .translate(t);

        // Compute the bounds of a feature of interest, then derive scale & translate.

        // Update the projection to use computed scale & translate.
        // projection
        //     .scale(s)
        //     .translate(t);
        // svg.append("path")
        //     .datum(counties)
        //     .attr("class", "outline")
        //     .attr("d", path);

        // svg.selectAll("text")
        //     .data(counties.features)
        // .enter().append("text")
        //     .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
        //     .attr("dy", ".35em")
        //     .text(function(d) { return d.properties.name; });

        return (
            <svg height={height}
                 width={width}>
                 {counties.features.map( c =>
                    <Path shape={path(c)}/>
                  )}
            </svg>
        )

    }
}

Map.propTypes = {
    json: PropTypes.object.isRequired,
    height: PropTypes.number,
    width: PropTypes.number
}
