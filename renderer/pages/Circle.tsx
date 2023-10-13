import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function Circle ({ radius, fillColor, onLeftClick, onRightClick }: { radius: number, fillColor: string, onLeftClick?: Function, onRightClick?: Function }) {
  const svgRef = useRef(null);

  function handleLeftClick() {
    onLeftClick?.();
    console.log("clicked");
  }

  function handleRightClick(e) {
    e.preventDefault()
    onRightClick?.();
    console.log("right-clicked");
  }

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    // Create the circle element
    svg
      .append('circle')
      .attr('cx', radius)
      .attr('cy', radius)
      .attr('r', radius)
      .attr('fill', fillColor) // You can change the fill color as needed
      .on('click', handleLeftClick)
      .on('contextmenu', handleRightClick)

  }, [ radius, fillColor, handleLeftClick, handleRightClick ]);

  return (
      <svg ref={svgRef} width={radius * 2} height={radius * 2}>
        {/* SVG container for the circle */}
      </svg>
    
  );
};

export default Circle;
