import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import appendQuadCurve from '../functions/appendQuadCurve'


function CurveTest() {
    const svgRef = useRef(null);
    
    const start = [50, 100];
    const control = [150, 20];
    const end = [250, 100];

    useEffect(() => {
        console.log("render")
        const svg = d3.select(svgRef.current);

        appendQuadCurve(svg, start, control, end)

    }, [])
    
    return <svg viewBox="0 0 450 300" className="chart" ref={svgRef}></svg>;
}

export default CurveTest;
