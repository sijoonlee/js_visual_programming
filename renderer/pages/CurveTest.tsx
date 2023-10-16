import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import QuadraticCurve from '../d3Components/QuadraticCurve'
import BezierCurve from '../d3Components/BezierCurve'
import Rectangle from '../d3Components/Rectangle'


function CurveTest() {
    const svgRef = useRef(null);

    useEffect(() => {
        console.log("render")
        const data = [
            {
                order: 0,
                type: QuadraticCurve,
                properties: {
                    startX: 50,
                    startY: 100,
                    controlX: 150,
                    controlY: 20,
                    endX: 250,
                    endY: 100,
                    stroke: 'blue',
                }
            },
            {
                order: 0,
                type: QuadraticCurve,
                properties: {
                    startX: 100,
                    startY: 50,
                    controlX: 10,
                    controlY: 20,
                    endX: 250,
                    endY: 100,
                    stroke: 'yellow',
                }
            },
            {
                order: 2,
                type: Rectangle,
                properties: {
                    startX: 10,
                    startY: 10,
                    width: 50,
                    height: 50
                }
            },
            {
                order: 4,
                type: Rectangle,
                properties: {
                    startX: 15,
                    startY: 15,
                    width: 50,
                    height: 50
                }
            },
            {
                order: 3,
                type: BezierCurve,
                properties: {
                    startX: 120,
                    startY: 50,
                    controlAX: 20,
                    controlAY: 40,
                    controlBX: 100,
                    controlBY: 120,
                    endX: 200,
                    endY: 200
                }
            },
        ]

        const svg = d3.select(svgRef.current);

        const layers = []
        const items = []

        for(const item of data) {
            const layer = svg.append('g')
            layers.push(layer);
            items.push(new item.type(layer, item.properties));
        }
        
        setTimeout(() => {
            items[0].recreate(layers[1])
            items[1].recreate(layers[0])
            items[2].recreate(layers[3])
            items[3].recreate(layers[2])
        }, 500)

    }, [])
    
    return <svg viewBox="0 0 450 300" className="chart" ref={svgRef}></svg>;
}

export default CurveTest;
