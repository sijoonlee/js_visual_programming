import * as d3 from 'd3';
import QuadraticCurve from './QuadraticCurve';


class Rectangle {
    id;

    svg;
    rect;
    circleBottomRight;
    circleAnchorRight;

    startX: number;
    startY: number;
    width: number;
    height: number;

    onDoubleClick: Function | undefined;
    onMove: Function | undefined;

    onAddAnchor: Function | undefined;
    onRemoveAnchor: Function | undefined;
    onDragAnchor: Function | undefined;
    onClickAnchor: Function | undefined;

    isEditing: boolean;

    constructor(id: string, svg: d3.Selection<any, unknown, null, undefined>,
        { startX, startY, width, height, onDoubleClick, onMove, onAddAnchor, onRemoveAnchor, onClickAnchor, onDragAnchor }
        : { startX: number, startY: number, width: number, height: number, onDoubleClick?: Function, onMove?: Function, onAddAnchor?: Function, onRemoveAnchor?: Function, onClickAnchor?: Function, onDragAnchor?: Function }    
    ) {
        const instance = this;
        instance.id = id;
        instance.svg = svg;
        instance.startX = startX;
        instance.startY = startY;
        
        instance.width = width;
        instance.height = height;
        instance.isEditing = false;
        instance.onDoubleClick = onDoubleClick;
        instance.onMove = onMove;
        instance.onAddAnchor = onAddAnchor;
        instance.onRemoveAnchor = onRemoveAnchor;
        instance.onDragAnchor = onDragAnchor;
        instance.onClickAnchor = onClickAnchor;

        instance.create()
    }

    create() {
        const instance = this;

        instance.rect = instance.svg
            .append('rect')
            .attr('x', instance.startX)
            .attr('y', instance.startY)
            .attr('width', instance.width)
            .attr('height', instance.height)
            .attr('fill', 'blue')
            .attr('stroke', 'red')
            .attr('stroke-width', 2)
            .call(d3.drag().on('drag', function (event) {
                const dx = event.dx
                const dy = event.dy

                instance.moveByDifference(dx, dy);
                instance.onMove?.(instance, dx, dy);
            }))
            .on('dblclick', function () {
                instance.toggleEdit();
                instance.onDoubleClick?.(instance);
            })

        instance.circleAnchorRight = instance.svg
            .append('circle')
            .attr('cx', instance.startX + instance.width)
            .attr('cy', instance.startY + instance.height / 2)
            .attr('r', 5)
            .attr('fill', 'green')
            .on('click', function(event){
                console.log('click', event)
                const curve = new QuadraticCurve(instance.svg, {
                    startX: instance.startX + instance.width,
                    startY: instance.startY + instance.height / 2,
                    controlX: instance.startX + instance.width + 10,
                    controlY: instance.startY + instance.height,
                    endX: instance.startX + instance.width + 20,
                    endY: instance.startY + instance.height / 2,
                    stroke: 'green',
                    onDrag: instance.onDragAnchor
                })
                curve.toggleEdit();
                instance.onAddAnchor?.(curve);
            })
    }

    moveByDifference(dx: number, dy: number) {
        this.startX += dx
        this.startY += dy
        this.rect.attr('x', this.startX).attr('y', this.startY)

        if (this.circleAnchorRight) {
            this.circleAnchorRight.attr('cx', this.startX + this.width).attr('cy', this.startY + this.height/2);
        }
        if (this.circleBottomRight) {
            this.circleBottomRight.attr('cx', this.startX + this.width).attr('cy', this.startY + this.height);
        }
    }

    recreate(svg) {
        this.remove();
        this.svg = svg;
        this.create();
    }

    toggleEdit() {
        this.isEditing = !this.isEditing;

        if (this.isEditing) {
            this.createCircleBottomRight()
        } else {
            this.removeCircleBottomRight()
        }
    }

    createCircleBottomRight() {
        const instance = this
        instance.circleBottomRight = instance.svg
            .append('circle')
            .attr('cx', instance.startX + instance.width)
            .attr('cy', instance.startY + instance.height)
            .attr('r', 5)
            .attr('fill', 'green')
            .call(d3.drag().on('drag', function (event) {
                let dx = event.dx;
                let dy = event.dy;

                if (dx < 0 && instance.width + dx <= 10) {
                    dx = 0
                }
                if (dy < 0 && instance.height + dy <= 10) {
                    dy = 0
                }

                instance.width += dx
                instance.height += dy

                d3.select(this).attr("cx", instance.startX + instance.width).attr("cy", instance.startY + instance.height);
                instance.rect.attr('x', instance.startX)
                    .attr('y', instance.startY)
                    .attr('width', instance.width)
                    .attr('height', instance.height)

                instance.onMove?.(instance);
            }));
    }

    removeCircleBottomRight() {
        this.circleBottomRight?.remove();
    }

    remove() {
        this.rect?.remove();
        this.circleBottomRight?.remove();
    }

}

export default Rectangle;
