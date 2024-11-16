export class GridObj{
    constructor(x, y, texture, onclick){    //x pos, y pos, texture, function
        this.x = x;
        this.y = y;
        this.texture = texture;
        this.onclick = onclick;
    }
}

export class GridObjL{
    constructor(x, y, gridObjects, onclick){    //x size, y size, array od gridObj's, function
        this.x = x;
        this.y = y;
        this.gridObjects = gridObjects;
        this.onclick = onclick;
    }
}

export class Grid {
    constructor(cellSize, x, y, sizex, sizey, gridObj, gridObjL){
        this.cellSize = cellSize;
        this.x = x;
        this.y = y;
        this.sizex = sizex;
        this.sizey = sizey;
        this.gridObj = gridObj;
        this.gridObjL = gridObjL;
        this.cells = [];
    }
    drawCell(gridObj){
        const obj = new PIXI.Sprite(gridObj.texture);
        obj.x = this.x+gridObj.x*this.cellSize;
        obj.y = this.y+gridObj.y*this.cellSize;
        obj.eventMode = "static";
        obj.cursor = "pointer";
        obj.on("pointerdown", gridObj.onclick);
        this.cells.push(obj);
    }
    drawGrid(){
        this.gridObj.forEach(element => this.drawCell(element));
    }
}