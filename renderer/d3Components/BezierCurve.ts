import * as d3 from 'd3';


class BezierCurve {
    svg;
    line;
    startCircle;
    controlCircleA;
    controlCircleB;
    endCircle;

    startX: number;
    startY: number;
    controlAX: number;
    controlAY: number;
    controlBX: number;
    controlBY: number;
    endX: number;
    endY: number;

    isEditing: boolean;

    onDoubleClick: Function | undefined;
    onChange: Function | undefined;

    constructor(svg: d3.Selection<any, unknown, null, undefined>,
        { startX, startY, controlAX, controlAY, controlBX, controlBY, endX, endY, onDoubleClick, onChange }
        : { startX: number, startY: number, controlAX: number, controlAY: number, controlBX: number, controlBY: number, endX: number, endY: number, onDoubleClick?: Function, onChange?: Function }
    ) {
        const instance = this
        instance.svg = svg;
        instance.startX = startX;
        instance.startY = startY;
        instance.controlAX = controlAX;
        instance.controlAY = controlAY;
        instance.controlBX = controlBX;
        instance.controlBY = controlBY;
        instance.endX = endX;
        instance.endY = endY;
        instance.isEditing = false;
        instance.onDoubleClick = onDoubleClick;
        instance.onChange = onChange;

        instance.create()
    }

    create() {
        const instance = this;
        const path = d3.path();
        path.moveTo(instance.startX, instance.startY);
        path.bezierCurveTo(instance.controlAX, instance.controlAY, instance.controlBX, instance.controlBY, instance.endX, instance.endY);

        instance.line = instance.svg
            .append('path')
            .attr('d', path.toString())
            .attr('stroke', 'blue')
            .attr('stroke-width', 2)
            .attr('fill', 'none')
            .call(d3.drag().on('drag', function (event) {
                instance.startX += event.dx;
                instance.startY += event.dy;
                instance.controlAX += event.dx;
                instance.controlAY += event.dy;
                instance.controlBX += event.dx;
                instance.controlBY += event.dy;
                instance.endX += event.dx;
                instance.endY += event.dy;
                
                if (instance.startCircle) {
                    instance.startCircle.attr("cx", instance.startX).attr("cy", instance.startY);
                }
                if (instance.controlCircleA) {
                    instance.controlCircleA.attr("cx", instance.controlAX).attr("cy", instance.controlAY);
                }
                if (instance.controlCircleB) {
                    instance.controlCircleB.attr("cx", instance.controlBX).attr("cy", instance.controlBY);
                }
                if (instance.endCircle) {
                    instance.endCircle.attr("cx", instance.endX).attr("cy", instance.endY);
                }               

                const updatedPath = d3.path();
                updatedPath.moveTo(instance.startX, instance.startY);
                updatedPath.bezierCurveTo(instance.controlAX, instance.controlAY, instance.controlBX, instance.controlBY, instance.endX, instance.endY);
                instance.line.attr('d', updatedPath.toString());

                instance.onChange?.(instance);
            }))
            .on('dblclick', function () {
                instance.toggleEdit();
                instance.onDoubleClick?.(instance);
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
            this.createcontrolCircleA();
            this.createcontrolCircleB();
            this.createEndCircle();
        } else {
            this.removeStartCircle();
            this.removecontrolCircleA();
            this.removecontrolCircleB();
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
                updatedPath.bezierCurveTo(instance.controlAX, instance.controlAY, instance.controlBX, instance.controlBY, instance.endX, instance.endY);
                instance.line.attr('d', updatedPath.toString());

                instance.onChange?.(instance);
            }));
    }

    createcontrolCircleA() {
        const instance = this;

        instance.controlCircleA = instance.svg
            .append('circle')
            .attr('cx', instance.controlAX)
            .attr('cy', instance.controlAY)
            .attr('r', 5)
            .attr('fill', 'red')
            .call(d3.drag().on('drag', function (event) {
                instance.controlAX += event.dx;
                instance.controlAY += event.dy;

                d3.select(this).attr("cx", instance.controlAX).attr("cy", instance.controlAY);
                const updatedPath = d3.path();
                updatedPath.moveTo(instance.startX, instance.startY);
                updatedPath.bezierCurveTo(instance.controlAX, instance.controlAY, instance.controlBX, instance.controlBY, instance.endX, instance.endY);
                instance.line.attr('d', updatedPath.toString());

                instance.onChange?.(instance);
            }));
    }

    createcontrolCircleB() {
        const instance = this;

        instance.controlCircleB = instance.svg
            .append('circle')
            .attr('cx', instance.controlBX)
            .attr('cy', instance.controlBY)
            .attr('r', 5)
            .attr('fill', 'red')
            .call(d3.drag().on('drag', function (event) {
                instance.controlBX += event.dx;
                instance.controlBY += event.dy;

                d3.select(this).attr("cx", instance.controlBX).attr("cy", instance.controlBY);
                const updatedPath = d3.path();
                updatedPath.moveTo(instance.startX, instance.startY);
                updatedPath.bezierCurveTo(instance.controlAX, instance.controlAY, instance.controlBX, instance.controlBY, instance.endX, instance.endY);
                instance.line.attr('d', updatedPath.toString());

                instance.onChange?.(instance);
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
            updatedPath.bezierCurveTo(instance.controlAX, instance.controlAY, instance.controlBX, instance.controlBY, instance.endX, instance.endY);
            instance.line.attr('d', updatedPath.toString());

            instance.onChange?.(instance);
        }));
    }

    removeLine() {
        this.line?.remove()
    }
    removeStartCircle() {
        this.startCircle?.remove()
    }
    removecontrolCircleA() {
        this.controlCircleA?.remove()
    }
    removecontrolCircleB() {
        this.controlCircleB?.remove()
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
        this.removecontrolCircleA();
        this.removecontrolCircleB();
        this.removeEndCircle();
    }

}

export default BezierCurve;
