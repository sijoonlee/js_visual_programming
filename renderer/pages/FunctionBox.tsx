import React, { useEffect, useRef, useState } from 'react';

import Circle from './Circle';
import EditableBox from './EditableBox';
import CurvedLine from './CurvedLine';


function FunctionBox() {

    const startCircleRef = useRef(null);
    const endCircleRef = useRef(null);
    const listCircle = [
        { key: 1, id: 1, left: '5px', top: '95px', radius: 10, fillColor: 'red', onLeftClick: getHandleLeftClickCircle(1), onRightClick: handleRightClickCircle },
        { key: 2, id: 2, left: '120px', top: '95px', radius: 10, fillColor: 'red', onLeftClick: getHandleLeftClickCircle(2), onRightClick: handleRightClickCircle },
    ]

    const listCurvedLine = []

    const [ lineFromTo, setLineFromTo ] = useState(null)

    useEffect(() => {
        if (lineFromTo != null) {
            console.log("draw line")
            listCurvedLine.push(lineFromTo)
        }

    }, [lineFromTo])

    function getHandleLeftClickCircle(id) {
        return () => {
            if (startCircleRef.current == null) {
                startCircleRef.current = id
            } else if (endCircleRef.current == null && startCircleRef.current !== id) {
                endCircleRef.current = id
                setLineFromTo({ start: startCircleRef.current, end: endCircleRef.current })
            }
            console.log(startCircleRef.current, endCircleRef.current)
        }
    }
    function handleRightClickCircle() {
        if (endCircleRef.current != null) {
            endCircleRef.current = null
        } else if (startCircleRef.current != null) {
            startCircleRef.current = null
        }
        console.log(startCircleRef.current, endCircleRef.current)
    }

    return <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: '5px', top: '5px' }}>
            <EditableBox
                margin={5}
                width={100}
                height={100}
                fillColor='blue'
                text='test'
            />
        </div>
        <div style={{ position: 'absolute', left: '120px', top: '5px' }}>
            <EditableBox
                margin={5}
                width={100}
                height={100}
                fillColor='blue'
                text='test'
            />
        </div>
        {listCircle.map(item => {
            return <div style={{ position: 'absolute', left: item.left, top: item.top }}>
                <Circle radius={item.radius} fillColor={item.fillColor} onLeftClick={item.onLeftClick} onRightClick={item.onRightClick}/>
            </div>
        })}
        
        {lineFromTo && <div style={{ position: 'absolute', left: '0px', top: '0px' }}>
                <CurvedLine startX={10} startY={95} endX={120} endY={95}/>
            </div> 
        }
    </div>
}

export default FunctionBox;