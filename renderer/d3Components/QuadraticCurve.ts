import * as d3 from 'd3';
import EventEmitter from 'events';

class QuadraticCurve {
    svg;
    line;
    startCircle;
    controlCircle;
    endCircle;

    startX: number;
    startY: number;
    controlX: number;
    controlY: number;
    endX: number;
    endY: number;
    stroke: string;

    isEditing: boolean;
    
    onDoubleClick: Function | undefined;
    onDrag: Function | undefined;

    eventEmitter = new EventEmitter();

    constructor(svg: d3.Selection<any, unknown, null, undefined>,
        { startX, startY, controlX, controlY, endX, endY, stroke, onDoubleClick, onDrag }
        : { startX: number, startY: number, controlX: number, controlY: number, endX: number, endY: number, stroke: string, onDoubleClick?: Function, onDrag?: Function }
    ) {
        const instance = this;
        instance.svg = svg;
        instance.startX = startX;
        instance.startY = startY;
        instance.controlX = controlX;
        instance.controlY = controlY;
        instance.endX = endX;
        instance.endY = endY;
        instance.stroke = stroke;
        instance.isEditing = false;
        instance.onDoubleClick = onDoubleClick;
        instance.onDrag = onDrag;

        instance.create()
        
    }
    create() {
        const instance = this;
        const path = d3.path();
        path.moveTo(instance.startX, instance.startY);
        path.quadraticCurveTo(instance.controlX, instance.controlY, instance.endX, instance.endY);

        instance.line = instance.svg
            .append('path')
            .attr('d', path.toString())
            .attr('stroke', instance.stroke)
            .attr('stroke-width', 2)
            .attr('fill', 'none')
            .call(d3.drag().on('drag', function (event) {
                instance.startX += event.dx;
                instance.startY += event.dy;
                instance.controlX += event.dx;
                instance.controlY += event.dy;
                instance.endX += event.dx;
                instance.endY += event.dy;
                
                if (instance.startCircle) {
                    instance.startCircle.attr("cx", instance.startX).attr("cy", instance.startY);
                }
                if (instance.controlCircle) {
                    instance.controlCircle.attr("cx", instance.controlX).attr("cy", instance.controlY);
                }
                if (instance.endCircle) {
                    instance.endCircle.attr("cx", instance.endX).attr("cy", instance.endY);
                }               

                const updatedPath = d3.path();
                updatedPath.moveTo(instance.startX, instance.startY);
                updatedPath.quadraticCurveTo(instance.controlX, instance.controlY, instance.endX, instance.endY);
                instance.line.attr('d', updatedPath.toString());

                instance.onDrag?.(instance)

                instance.eventEmitter.emit('moved', instance)
                
            }))
            .on('dblclick', function () {
                instance.toggleEdit();
                instance.onDoubleClick?.(instance)
            })
            .on('mouseover', function () {
                instance.line.attr('stroke-width', 5)
            })
            .on('mouseout', function (){
                instance.line.attr('stroke-width', 2)
            })
    }

    recreate(svg) {
        this.remove();
        this.svg = svg;
        this.create();
    }
    toggleEdit() {
        this.isEditing = !this.isEditing;
        if (this.isEditing) {
            this.createStartCircle();
            this.createControlCircle();
            this.createEndCircle();
        } else {
            this.removeStartCircle();
            this.removeControlCircle();
            this.removeEndCircle();
        }
    }

    createStartCircle() {
        const instance = this;
        // start circle
        instance.startCircle = instance.svg
            .append('circle')
            .attr('cx', instance.startX)
            .attr('cy', instance.startY)
            .attr('r', 5)
            .attr('fill', 'red')
            .call(d3.drag().on('drag', function (event) {
                instance.startX += event.dx;
                instance.startY += event.dy;

                d3.select(this).attr("cx", instance.startX).attr("cy", instance.startY);
                const updatedPath = d3.path();
                updatedPath.moveTo(instance.startX, instance.startY);
                updatedPath.quadraticCurveTo(instance.controlX, instance.controlY, instance.endX, instance.endY);
                instance.line.attr('d', updatedPath.toString());

                instance.onDrag?.(instance)
            }));
    }

    createControlCircle() {
        const instance = this;

        instance.controlCircle = instance.svg
            .append('circle')
            .attr('cx', instance.controlX)
            .attr('cy', instance.controlY)
            .attr('r', 5)
            .attr('fill', 'red')
            .call(d3.drag().on('drag', function (event) {
                instance.controlX += event.dx;
                instance.controlY += event.dy;

                d3.select(this).attr("cx", instance.controlX).attr("cy", instance.controlY);
                const updatedPath = d3.path();
                updatedPath.moveTo(instance.startX, instance.startY);
                updatedPath.quadraticCurveTo(instance.controlX, instance.controlY, instance.endX, instance.endY);
                instance.line.attr('d', updatedPath.toString());

                instance.onDrag?.(instance)
            }));
    }

    createEndCircle() {
        const instance = this;

        instance.endCircle = instance.svg
        .append('circle')
        .attr('cx', instance.endX)
        .attr('cy', instance.endY)
        .attr('r', 5)
        .attr('fill', 'red')
        .call(d3.drag().on('drag', function (event) {
            instance.endX += event.dx;
            instance.endY += event.dy;
            d3.select(this).attr("cx", instance.endX).attr("cy", instance.endY);
            const updatedPath = d3.path();
            updatedPath.moveTo(instance.startX, instance.startY);
            updatedPath.quadraticCurveTo(instance.controlX, instance.controlY, instance.endX, instance.endY);
            instance.line.attr('d', updatedPath.toString());

            instance.onDrag?.(instance)
        }));
    }

    removeLine() {
        this.line?.remove()
    }
    removeStartCircle() {
        this.startCircle?.remove()
    }
    removeControlCircle() {
        this.controlCircle?.remove()
    }
    removeEndCircle() {
        this.endCircle?.remove()
    }
    remove() {
        if (this.svg == null) {
            return;
        }
        this.removeLine();
        this.removeStartCircle();
        this.removeControlCircle();
        this.removeEndCircle();
    }

}

export default QuadraticCurve;
