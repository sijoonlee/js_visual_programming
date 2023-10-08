import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

function EditableBox({ x, y, width, height, fillColor, text, onTextChange }) {
  const svgRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    const handleDoubleClick = () => {
      setIsEditing(true);
    };

    const handleBlur = () => {
      if (editedText !== text) {
        onTextChange(editedText); // Notify the parent component of the text change
      }
    };

    const handleKeyPress = (e) => {
      if (isEditing && e.key === 'Enter') {
        handleBlur();
        setIsEditing(false);
      }
    };

    // Create SVG rectangles for the editable boxes
    svg
      .append('rect')
      .attr('x', x)
      .attr('y', y)
      .attr('width', width)
      .attr('height', height)
      .attr('fill', fillColor)
      .on('dblclick', handleDoubleClick);

    // Create text labels inside the boxes or input fields when editing
    if (isEditing) {
      const foreignObject = svg
        .append('foreignObject')
        .attr('x', x)
        .attr('y', y)
        .attr('width', width)
        .attr('height', height);

      const input = foreignObject
        .append('xhtml:input')
        .attr('type', 'text')
        .attr('value', editedText)
        .attr('style', 'width: 100%; height: 100%;')
        .on('blur', handleBlur)
        .on('input', (e) => setEditedText(e.target.value))
        .on('keypress', handleKeyPress) // Handle Enter key
        .node();

      input.focus();
    } else {
      const textElement = svg
        .append('text')
        .attr('x', x + width / 2)
        .attr('y', y + height / 2)
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr('fill', 'white')
        .text(text)
        .on('dblclick', handleDoubleClick);
    }
  }, [x, y, width, height, fillColor, text, isEditing, editedText, onTextChange]);

  return (
    <svg width="100%" height="100%" ref={svgRef} xmlns="http://www.w3.org/2000/svg" />
  );
}

function App() {
  const [box1Text, setBox1Text] = useState('Box 1');
  const [box2Text, setBox2Text] = useState('Box 2');

  return (
    <div className="App">
      <EditableBox x={50} y={50} width={100} height={40} fillColor="red" text={box1Text} onTextChange={setBox1Text} />
      <EditableBox x={250} y={50} width={100} height={40} fillColor="green" text={box2Text} onTextChange={setBox2Text} />
    </div>
  );
}

export default App;