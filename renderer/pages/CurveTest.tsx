import React, { useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import * as d3 from 'd3';
import QuadraticCurve from '../d3Components/QuadraticCurve'
import BezierCurve from '../d3Components/BezierCurve'
import Rectangle from '../d3Components/Rectangle'
import Group from '../d3Components/Group'

function CurveTest() {
    const svgRef = useRef(null);

    useEffect(() => {
        console.log("render")
        const data = [
            {
                id: uuidv4(),
                type: Rectangle,
                properties: {
                    startX: 10,
                    startY: 10,
                    width: 50,
                    height: 50
                }
            },
            {
                id: uuidv4(),
                type: Rectangle,
                properties: {
                    startX: 15,
                    startY: 15,
                    width: 50,
                    height: 50
                }
            },        ]

        const svg = d3.select(svgRef.current);

        const groupA = new Group(svg);
        const groupB = new Group(svg);

        groupA.createChild(data[0])
        groupA.createChild(data[1])

        setTimeout(() => {
            const child = groupA.getChild(data[0].id)
            groupA.removeChild(data[0].id)
            groupB.addChild(child)
        }, 500)

    }, [])
    
    return <svg viewBox="0 0 450 300" className="chart" ref={svgRef}></svg>;
}

export default CurveTest;
