import * as d3 from 'd3';



class Group {
    children: any;
    group: any;

    constructor(svg) {
        this.children = {};
        this.group = svg.append('g')
    }

    get() {
        return this.group;
    }

    getChild(id) {
        return this.children[id]
    }

    createChild(childProperties) {
        const child = new childProperties.type(childProperties.id, this.group, childProperties.properties)
        this.children[child.id] = child
    }

    addChild(child) {
        child.recreate(this.group)
        this.children[child.id] = child
    }

    removeChild(id) {
        this.children[id].remove()
        delete this.children[id]
    }

}

export default Group;
