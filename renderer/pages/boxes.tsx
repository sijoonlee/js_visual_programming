import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function CurvedLine({ startX, startY, endX, endY }) {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    const controlPointX = (startX + endX) / 2;
    const controlPointY = startY - 50; // Adjust this value to control the curve shape

    const line = d3.line().curve(d3.curveBasis);

    const pathData = line([
      [startX, startY],
      [controlPointX, controlPointY],
      [endX, endY],
    ]);

    svg
      .append('path')
      .attr('d', pathData)
      .attr('fill', 'transparent')
      .attr('stroke', 'blue')
      .attr('stroke-width', 2);

    // Create SVG rectangles for the boxes with text labels
    svg
      .append('rect')
      .attr('x', startX - 20) // Adjust the dimensions and positions as needed
      .attr('y', startY - 20)
      .attr('width', 40)
      .attr('height', 40)
      .attr('fill', 'red');

    svg
      .append('text')
      .attr('x', startX) // Adjust the text position
      .attr('y', startY) // Adjust the text position
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .attr('fill', 'white')
      .text('Here'); // Add text to the first box

    svg
      .append('rect')
      .attr('x', endX - 20) // Adjust the dimensions and positions as needed
      .attr('y', endY - 20)
      .attr('width', 40)
      .attr('height', 40)
      .attr('fill', 'green');

    svg
      .append('text')
      .attr('x', endX) // Adjust the text position
      .attr('y', endY) // Adjust the text position
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .attr('fill', 'white')
      .text('There'); // Add text to the second box
  }, [startX, startY, endX, endY]);

  return (
    <svg width="100%" height="100%" ref={svgRef} xmlns="http://www.w3.org/2000/svg" />
  );
}

function App() {
  return (
    <div className="App">
      <CurvedLine startX={50} startY={50} endX={250} endY={150} />
    </div>
  );
}

export default App;