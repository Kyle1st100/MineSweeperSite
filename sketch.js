
const $ = (selector) => document.querySelector(selector)
const arrayInclude = (matrix,arr2) => {
    for(let i = 0; i<matrix.length; i++){
        if(matrix[i][0] === arr2[0] && matrix[i][1] === arr2[1]) return true
    }
    return false
}
class Game{
    constructor({width = 400, rows=20, columns=20, height = 400, mines=36}){
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

    /**
     * generates all the cells and show them graphically
    */
    generateCells(){
        for(let row = 0; row<this.rows; row++){
            this.cells[row] = []
            for(let column = 0; column<this.columns; column++){
                this.cells[row][column] = new Cell({column, row, height: this.cellHeight, width: this.cellWidth})
                this.cells[row][column].showBlocked()
            }
        }
    }

    /**
     * generates all the mines
     * @param {Number} row - the row of the cellClicked
     * @param {Number} column - the column of the cellClicked
    */

    insertMines(row, column){
        const cellClicked = [row, column]
        for(let mine = 0; mine<this.cantMines; mine++){
            this.mines[mine] = this.generateMine(cellClicked)
        }
        this.generateNumbers()
    }

    /**
     * assign the 💣 value to a random cell 
     * @param {Cell} cellClicked - a cell object
     * @return {[Number]} returns an array with the position of the new Mine
    */
    generateMine(cellClicked){
        let randomRow = cellClicked[0]
        let randomCol = cellClicked[1]
        while((randomRow === cellClicked[0] && randomCol === cellClicked[1]) || arrayInclude(this.mines, [randomRow, randomCol])){
            randomRow = Math.floor(Math.random()*this.rows)
            randomCol = Math.floor(Math.random()*this.columns)
        }
        const newMine = [randomRow, randomCol]
        this.cells[randomRow][randomCol].value = "💣"
        return newMine
    }

    /**
     * assign the values of the cells around the mines
     * 
    */
    generateNumbers(){
        for(let mine = 0; mine<this.cantMines; mine ++){
            let minePosition = this.mines[mine]
            this.getCellsAroundAndDoInEachCell(minePosition, this.countMinesAround)
        }
        this.displayGrid()
    }

    /**
     * displays a table-type log of the grid values ​​in the console
     */
    displayTableGrid = () =>{
        const arr = []
        this.cells.forEach(row =>{
            let arr2 = [];
            row.forEach(cell =>{
                arr2.push(cell.value)
            })
            arr.push(arr2)
        })
    }

    /**
     * display all the grid visually
     */
    displayGrid = () =>{
        this.cells.forEach(row =>{
            row.forEach(cell => {cell.click()})
        })
    }

    /**
     * count the mines around the cell delivered as a param and assign them to the value property
     * @param {Cell} cell - a Cell object
     */
    countMinesAround = (cell) =>{
        if(cell.value === "💣") return
        let minesAround = 0
        const aroundMineCounter = (cell) =>{
            if(cell.value === "💣") minesAround++
        }
        if(cell.value === 0 && cell.value != "💣"){
            this.getCellsAroundAndDoInEachCell(cell.position, aroundMineCounter)
            cell.value = minesAround
        }    
    }

    /**
     * get all the cells around and executes a function in each cell around the position
     * @param {[Number]} position - The position of the the cell e.g. position = [row, column].
     * @param {Function} fn - function thats executed in each cell around the position, receive as a param one cell around
     * @return {[Cell]} returns an array with the cells around of the position
     */
    getCellsAroundAndDoInEachCell(position, fn){
        const positionsToMove = [-1,0,1]
        const cellsAround = []
        positionsToMove.forEach(pos =>{
            positionsToMove.forEach(pos2=>{
                if(pos === 0 && pos2 === 0) return;
                if (this.cells[position[0]+pos] && this.cells[position[0]+pos][position[1]+pos2]){
                    const cellAround = this.cells[position[0]+pos][position[1]+pos2]
                    cellsAround.push(cellAround)
                    fn(cellAround)
                }
            })
        })
        return cellsAround
    }

    mouseClicked(){
        const row = Math.floor(mouseY / this.cellHeight)
        const column = Math.floor(mouseX / this.cellWidth)
        if(this.mines[0] === undefined) this.insertMines(row, column)
        let cellSelected = this.cells[row][column]
        cellSelected.click()
        if(cellSelected.value === 0) this.displayArroundAllZeros(cellSelected)
    }

    /**
     * get all the cells around and executes a function in each cell around the position
     * @param {[Number]} position - The position of the the cell e.g. position = [row, column].
     * @param {Function} fn - function thats executed in each cell around the position, receive as a param one cell around
     * @return {[Cell]} returns an array with the cells around of the position
     */
    displayArroundAllZeros = (cellSelected) =>{
        const zerosCell = [cellSelected]
        const clickAround = (cell) =>{
            if(cell.value === 0 && !zerosCell.includes(cell)) zerosCell.push(cell)
            cell.click()
        }
        for(let cell of zerosCell){
            this.getCellsAroundAndDoInEachCell(cell.position, clickAround)
        }
    }
}
class Cell{
    constructor({column, row, height, width}){
        this.x = column * width
        this.y = row * height
        this.position = [row, column]
        this.column = column
        this.row = row
        this.height = height
        this.width = width
        this.value = 0
    }
    showBlocked(){
        rect(this.x,this.y, this.width, this.height)
    }
    click(){
        textSize(this.width);
        textAlign(CENTER, CENTER)
        switch (this.value) {
            case 1:
                fill(0, 0, 100) 
                break;
            case 2:
                fill(0, 100, 0) 
                break;
            case 3:
                fill(100 ,0, 0) 
                break;
            case 4:
                fill(0, 100, 100) 
                break;
            case 5:
                fill(100 , 100, 0) 
                break;
            case 6:
                fill(100 , 0, 100) 
                break;
            case 7:
                fill(0, 0, 200) 
                break;
            case 8:
                fill(200 , 0, 200) 
                break;
            case '💣':
                fill(0,0,0)
                break;
            case 0:
                fill(172, 167, 167);
                rect(this.x,this.y, this.width, this.height)
                break;
            default:
                fill(255 , 255, 255) 
                break;
        }
        text(this.value.toString(), this.x + this.width/2, this.y + this.height/2);
    }
}
//setup
const game = new Game({width: 500, height: 500})

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
