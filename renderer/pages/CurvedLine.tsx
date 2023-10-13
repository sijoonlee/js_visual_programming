import React from 'react';

function CurvedLine({ startX, startY, endX, endY }) {
  const controlPointX = (startX + endX) / 2;
  const controlPointY = startY - 50; // Adjust this value to control the curve shape

  return (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <path
        d={`M${startX},${startY} Q${controlPointX},${controlPointY} ${endX},${endY}`}
        fill="transparent"
        stroke="green"
        strokeWidth="2"
      />
    </svg>
  );
}

export default CurvedLine;