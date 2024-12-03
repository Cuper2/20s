export class GridObj {
    constructor(x, y, texture, onclick) {
        // x, y to pozycja przycisku, texture to tekstura, onclick to funkcja
        this.x = x;
        this.y = y;
        this.texture = texture;
        this.onclick = onclick;
    }
}

export class GridObjL {
    constructor(x, y, gridObjects, onclick) {
        // x, y to rozmiar, gridObjects to tablica przycisków, onclick to funkcja
        this.x = x;
        this.y = y;
        this.gridObjects = gridObjects;
        this.onclick = onclick;
    }
}

export class Grid {
    constructor(cellSize, x, y, sizex, sizey, gridObj, gridObjL) {
        this.cellSize = cellSize;  // Rozmiar komórki
        this.x = x;  // Pozycja x siatki
        this.y = y;  // Pozycja y siatki
        this.sizex = sizex;  // Szerokość siatki
        this.sizey = sizey;  // Wysokość siatki
        this.gridObj = gridObj;  // Tablica obiektów GridObj
        this.gridObjL = gridObjL;  // Tablica obiektów GridObjL
        this.cells = [];  // Komórki siatki
    }

    drawCell(gridObj) {
        // Rysuje pojedynczą komórkę
        const obj = new PIXI.Sprite(gridObj.texture);
        obj.x = this.x + gridObj.x * this.cellSize;
        obj.y = this.y + gridObj.y * this.cellSize;
        obj.eventMode = "static";
        obj.cursor = "pointer";
        obj.on("pointerdown", gridObj.onclick);
        this.cells.push(obj);
    }

    drawGrid() {
        // Rysuje siatkę z obiektami
        this.gridObj.forEach(element => this.drawCell(element));
    }
}
