import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';


function EditableBox({ margin, width, height, fillColor, text, onTextChange }:
  { margin: number, width: number, height: number, fillColor: string, text: string, onTextChange?: Function }
) {
  const svgRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  //const [editedText, setEditedText] = useState(text);
  const editedText = useRef(text)

  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    const handleDoubleClick = () => {
      setIsEditing(true);
    };

    // Create SVG rectangles for the editable boxes
    svg
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', width + margin * 2)
      .attr('height', height + margin * 2)
      .attr('fill', fillColor)
      .on('dblclick', handleDoubleClick)
      .on('contextmenu', handleRightClick)

    // Create text labels inside the boxes or input fields when editing
    if (isEditing) {
      const foreignObject = svg
        .append('foreignObject')
        .attr('x', margin)
        .attr('y', margin)
        .attr('width', width)
        .attr('height', height);

      const input = foreignObject
        .append('xhtml:input')
        .attr('type', 'text')
        .attr('value', editedText.current)
        .attr('style', 'width: 100%; height: 100%;')
        .on('blur', handleBlur)
        .on('input', (e) => editedText.current = e.target.value)
        .on('keypress', handleKeyPress) // Handle Enter key
        .node();

      input.focus();
    } else {
      const textElement = svg
        .append('text')
        .attr('x', margin + width / 2)
        .attr('y', margin + height / 2)
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr('fill', 'white')
        .text(editedText.current)
        .on('dblclick', handleDoubleClick);
    }
  }, [margin, width, height, fillColor, text, isEditing, onTextChange]);

  useEffect(() => {
    if (isVisible) {
      const contextMenu = d3.select('#context-menu');
      contextMenu.style('left', `${position.x}px`);
      contextMenu.style('top', `${position.y}px`);

      window.addEventListener('click', handleCloseMenu);
      return () => {
        window.removeEventListener('click', handleCloseMenu);
      };
    }
  }, [isVisible]);

  const handleRightClick = (e) => {
    console.log(e)
    e.preventDefault();
    console.log("test")
    const [x, y] = d3.pointer(event);
    setPosition({ x, y });
    setIsVisible(true);
  }

  const handleCloseMenu = () => {
    setIsVisible(false);
  };

  const handleBlur = () => {
    if (editedText.current !== text) {
      onTextChange?.(editedText.current); // Notify the parent component of the text change
    }
  };

  const handleKeyPress = (e) => {
    if (isEditing && e.key === 'Enter') {
      handleBlur();
      setIsEditing(false);
    }
  };

  return (
    <>
      <svg width={(width + margin * 2) + "px"} height={(height + margin * 2) + "px"} ref={svgRef} xmlns="http://www.w3.org/2000/svg" />
      {isVisible && (
        <div id="context-menu" className="context-menu">
          <ul>
            <li>Option 1</li>
            <li>Option 2</li>
            <li>Option 3</li>
          </ul>
        </div>
      )}
    </>

  );
}

export default EditableBox;
