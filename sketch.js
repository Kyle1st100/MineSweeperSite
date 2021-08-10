
const $ = (selector) => document.querySelector(selector)
const arrayInclude = (matrix,arr2) => {
    for(let i = 0; i<matrix.length; i++){
        if(matrix[i][0] === arr2[0] && matrix[i][1] === arr2[1]) return true
    }
    return false
}
class Game{
    constructor({width = 400, rows=5, columns=3, height = 600, mines=3}){
        this.width = width
        this.height = height
        this.rows = rows
        this.columns = columns
        this.cells = []
        this.cellHeight = height/rows
        this.cellWidth = width/columns
        this.mines = []
        this.cantMines = mines
    }

    createCanvas(){
        let renderer = createCanvas(this.width, this.height);
        renderer.parent("canvasContainer");
    }

    generateCells(){
        for(let row = 0; row<this.rows; row++){
            this.cells[row] = []
            for(let column = 0; column<this.columns; column++){
                this.cells[row][column] = new Cell({column, row, height: this.cellHeight, width: this.cellWidth})
                this.cells[row][column].showBlocked()
            }
        }
    }

    insertMines(row, column){
        const cellClicked = [row, column]
        for(let mine = 0; mine<this.cantMines; mine++){
            this.mines[mine] = this.generateMine(cellClicked)
        }
        this.generateNumbers()

        console.log("mines: ", this.mines)
        console.log("cells: ", this.cells)
    }

    generateMine(cellClicked){
        let randomRow = cellClicked[0]
        let randomCol = cellClicked[1]
        while((randomRow === cellClicked[0] && randomCol === cellClicked[1]) || arrayInclude(this.mines, [randomRow, randomCol])){
            randomRow = Math.floor(Math.random()*this.rows)
            randomCol = Math.floor(Math.random()*this.columns)
        }
        const newMine = [randomRow, randomCol]
        this.cells[randomRow][randomCol].value = "*"
        return newMine
    }

    generateNumbers(){
        for(let mine = 0; mine<this.cantMines; mine++){
            let positionActual = this.mines[mine]
            this.getCellsAround(positionActual).forEach(cellAround => {
                if(cellAround[0] >= 0 && cellAround[0] < this.rows && cellAround[1] >= 0 && cellAround[1] < this.columns ){
                    if(this.cells[cellAround[0]][cellAround[1]].value === 0){
                        this.getCellsAround(cellAround).forEach(anotherCellAround => {
                            if(anotherCellAround[0] >= 0 && anotherCellAround[0] < this.rows && anotherCellAround[1] >= 0 && anotherCellAround[1] < this.columns ){
                                if(this.cells[anotherCellAround[0]][anotherCellAround[1]].value === "*"){
                                    this.cells[cellAround[0]][cellAround[1]].value +=1
                                }
                            }
                        })
                    }
                }
            })
        }
    }
    getCellsAround(positionActual){
        const cellsAround = [[positionActual[0]-1,positionActual[1]-1],[positionActual[0]-1, positionActual[1]],[positionActual[0]-1, positionActual[1]+1],[positionActual[0], positionActual[1]+1],[positionActual[0]+1, positionActual[1]+1],[positionActual[0]+1, positionActual[1]],[positionActual[0]+1, positionActual[1]-1],[positionActual[0], positionActual[1]-1]]
        return cellsAround
    }
    // suerte
    mouseClicked(){
        const row = Math.floor(mouseY / this.cellHeight)
        const column = Math.floor(mouseX / this.cellWidth)
        if(this.mines[0] === undefined) this.insertMines(row, column)
        
        this.cells[row][column].click()
    }
}
class Cell{
    constructor({column, row, height, width}){
        this.x = column * width
        this.y = row * height
        this.height = height
        this.width = width
        this.value = 0
    }
    showBlocked(){
        rect(this.x,this.y, this.width, this.height)
    }
    click(){
        fill(51)
        rect(this.x,this.y, this.width, this.height)
    }
}
//setup
const $canvasContainer = $('#canvasContainer')
const sketchWidth = $canvasContainer.clientWidth;
const sketchHeight = $canvasContainer.clientHeight;
const game = new Game({width: sketchWidth, height: sketchHeight})

function setup() {
    game.createCanvas()
    game.generateCells()

}
  
function draw() {
    // background(340);
    // ellipse(50,50,80,80);
}
function mouseClicked(e) {
    game.mouseClicked()
    return false;
}
