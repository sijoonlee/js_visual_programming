import * as d3 from 'd3';


class Rectangle {
    svg;
    rect;
    circleBottomRight;

    startX: number;
    startY: number;
    width: number;
    height: number;

    onDoubleClick: Function | undefined;
    onChange: Function | undefined;

    isEditing: boolean;

    constructor(svg: d3.Selection<any, unknown, null, undefined>,
        { startX, startY, width, height, onDoubleClick, onChange }
        : { startX: number, startY: number, width: number, height: number, onDoubleClick?: Function, onChange?: Function }    
    ) {
        const instance = this;
        instance.svg = svg;
        instance.startX = startX;
        instance.startY = startY;
        
        instance.width = width;
        instance.height = height;
        instance.isEditing = false;
        instance.onDoubleClick = onDoubleClick;
        instance.onChange = onChange;

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
                instance.startX += event.dx
                instance.startY += event.dy
                instance.rect.attr('x', instance.startX).attr('y', instance.startY)

                if (instance.circleBottomRight) {
                    instance.circleBottomRight.attr('cx', instance.startX + instance.width).attr('cy', instance.startY + instance.height);
                }

                instance.onChange?.(instance);
            }))
            .on('dblclick', function () {
                instance.toggleEdit();
                instance.onDoubleClick?.(instance);
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

                if (dx < 0 && instance.width + dx <= 5) {
                    dx = 0
                }
                if (dy < 0 && instance.height + dy <= 5) {
                    dy = 0
                }

                instance.width += dx
                instance.height += dy

                d3.select(this).attr("cx", instance.startX + instance.width).attr("cy", instance.startY + instance.height);
                instance.rect.attr('x', instance.startX)
                    .attr('y', instance.startY)
                    .attr('width', instance.width)
                    .attr('height', instance.height)

                instance.onChange?.(instance);
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
