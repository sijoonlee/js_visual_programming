import * as d3 from 'd3';

const startCache = []
const controlCache = []
const endCache = []


function appendQuadCurve(svg, start, control, end) {
    startCache[0] = start[0]
    startCache[1] = start[1]
    controlCache[0] = control[0]
    controlCache[1] = control[1]
    endCache[0] = end[0]
    endCache[1] = end[1]

    const path = d3.path();
    path.moveTo(startCache[0], startCache[1]);
    path.quadraticCurveTo(controlCache[0], controlCache[1], endCache[0], endCache[1]);


    // Append the path to the SVG
    const line = svg
        .append('path')
        .attr('d', path.toString())
        .attr('stroke', 'blue')
        .attr('stroke-width', 2)
        .attr('fill', 'none')

    // start circle
    svg
        .append('circle')
        .attr('cx', startCache[0])
        .attr('cy', startCache[1])
        .attr('r', 5)
        .attr('fill', 'red')
        .call(d3.drag().on('drag', function (event) {
            const newStart = d3.pointer(event);
            startCache[0] = newStart[0]
            startCache[1] = newStart[1]

            d3.select(this).attr("cx", startCache[0]).attr("cy", startCache[1]);
            const updatedPath = d3.path();
            updatedPath.moveTo(startCache[0], startCache[1]);
            updatedPath.quadraticCurveTo(controlCache[0], controlCache[1], endCache[0], endCache[1]);
            line.attr('d', updatedPath.toString());
        }));
    // control circle
    svg
        .append('circle')
        .attr('cx', controlCache[0])
        .attr('cy', controlCache[1])
        .attr('r', 5)
        .attr('fill', 'red')
        .call(d3.drag().on('drag', function (event) {
            const newControl = d3.pointer(event);
            controlCache[0] = newControl[0]
            controlCache[1] = newControl[1]
            d3.select(this).attr("cx", event.x).attr("cy", event.y);
            const updatedPath = d3.path();
            updatedPath.moveTo(startCache[0], startCache[1]);
            updatedPath.quadraticCurveTo(controlCache[0], controlCache[1], endCache[0], endCache[1]);
            line.attr('d', updatedPath.toString());
        }));
    // end circle
    svg
        .append('circle')
        .attr('cx', end[0])
        .attr('cy', end[1])
        .attr('r', 5)
        .attr('fill', 'red')
        .call(d3.drag().on('drag', function (event) {
            const newEnd = d3.pointer(event);
            endCache[0] = newEnd[0]
            endCache[1] = newEnd[1]
            d3.select(this).attr("cx", endCache[0]).attr("cy", endCache[1]);
            const updatedPath = d3.path();
            updatedPath.moveTo(startCache[0], startCache[1]);
            updatedPath.quadraticCurveTo(controlCache[0], controlCache[1], newEnd[0], newEnd[1]);
            line.attr('d', updatedPath.toString());
        }));

    return svg
}

export default appendQuadCurve;
