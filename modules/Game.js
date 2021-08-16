import {Cell} from "./Cell.js"
class Game{
    constructor({rows=20, columns=20, mines=36, $timer, $points, $emoji, coop = false}){
        this.cellSize = 25;
        this.cellsRemaining = columns * rows - mines
        this.width = this.cellSize * columns
        this.height = this.cellSize * rows
        this.rows = rows
        this.columns = columns
        this.cells = []
        this.mines = []
        this.cantMines = mines
        this.cnv;
        this.$emoji = $emoji
        this.$timer = $timer;
        this.timerInterval;
        this.$points = $points;
        this.coop = coop
    }


    setupConnection = () =>{
        if(this.coop){
            this.ws = new WebSocket("wss://minesweeper.thiagocpu.repl.co/index.js:3000")
            this.ws.addEventListener("open", ()=>{
                this.cnv.mouseReleased(this.mouseReleased)
            })
            this.ws.addEventListener("message", ({data}) => {
                const json = JSON.parse(data)
                if(json.type === "click"){
                    console.log("click")
                    const {cords, mouseClicked} = json
                    const cell = this.cells[cords[0]][cords[1]]
                    this.cellClicked(cell, mouseClicked)
                }
                if(json.type === "mines"){
                    console.log("mines")
                    const {positions} = json
                    positions.forEach(pos => {
                        this.cells[pos[0]][pos[1]].value = "💣"
                        this.mines.push(this.cells[pos[0]][pos[1]])
                    })
                    this.startGame()
                    this.generateNumbers()
                }
                if(json.type === "points"){
                    this.$timer.innerText = json.data
                    this.$points.innerText = 1000 - 15 * json.data 
                }
                if(json.type === "restart") this.restart()
            })
        }
    }

    handleWin = () => {
        if(!this.cellsRemaining){
            this.gameWin()
            this.displayFlags()
        }
    }

    startGame = (cellSelected) =>{
        this.timerInterval = setInterval(()=>{
            this.$timer.innerText = +this.$timer.innerText + 1
            this.$points.innerText -= 15
        }, 1000);
        if(this.mines[0] === undefined) this.insertMines(cellSelected)   
    }

    gameWin = () => {
        clearInterval(this.timerInterval)
        this.cnv.mouseReleased(()=>{})
    }

    gameOver = () =>{
        clearInterval(this.timerInterval)
        this.$emoji.innerHTML = `
        <img src="../public/loseEmoji.png" width="40px">
        `
        this.$emoji.classList.remove("startActive")
        this.$points.innerText = 0;
        this.cnv.mouseReleased(()=>{})
    }
    sendRestart = () =>{
        if(this.coop){
            this.ws.send(JSON.stringify({type: "restart"}))
        }
    }
    restart = () =>{
        clearInterval(this.timerInterval)
        this.$timer.innerText = 0;
        this.$points.innerText = 1000
        this.$emoji.innerHTML = '😍'
        this.$emoji.classList.add("startActive")
        this.cellsRemaining = this.rows * this.columns - this.cantMines
        this.cells = []
        this.mines = []
        this.cnv.mouseReleased(this.mouseReleased)
        this.generateCells()
    }

    /**
     * generates all the cells and show them graphically
    */
    generateCells(){
        for(let row = 0; row<this.rows; row++){
            this.cells[row] = []
            for(let column = 0; column<this.columns; column++){
                this.cells[row][column] = new Cell({column, row, height: this.cellSize, width: this.cellSize})
                this.cells[row][column].showBlocked()
            }
        }
    }

    /**
     * generates all the mines
     * @param {Cell} cellSelected - the first cell clicked is required because we don't want the first cell clicked to be a mine
    */

    insertMines(cellSelected){
        const positions = []
        for(let mine = 0; mine<this.cantMines; mine++){
            this.mines[mine] = this.generateMine(cellSelected)
            positions.push(this.mines[mine].position)
        }
        if(this.coop) {
            this.ws.send(JSON.stringify({type: "mines", positions}))
        }
        this.generateNumbers()
    }

    /**
     * assign the 💣 value to a random cell 
     * @param {Cell} cellSelected - a cell object
     * @return {[Number]} returns an array with the position of the new Mine
    */
    generateMine = (cellSelected) => {
        let newMine = cellSelected
        while(newMine === cellSelected || newMine.value === "💣"){
            let randomRow = Math.floor(Math.random()*this.rows)
            let randomCol = Math.floor(Math.random()*this.columns)
            newMine = this.cells[randomRow][randomCol]
        }
        newMine.value = "💣"
        return newMine
    }

    /**
     * assign the values of the cells around the mines
     * 
    */
    generateNumbers(){
        for(let mine = 0; mine<this.cantMines; mine ++){
            let minePosition = this.mines[mine].position
            this.getCellsAroundAndDoInEachCell(minePosition, this.countMinesAround)
        }
        // this.displayGrid()
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

    sendCellClickedToServer = (cords) => {
        if(this.coop){
            this.ws.send(JSON.stringify({type: "click", cords, mouseClicked: mouseButton}))
        }
    }
 
    /**
     * handle the mousereleased event
     */
    mouseReleased = (e) =>{
        const row = Math.floor(mouseY / this.cellSize)
        const column = Math.floor(mouseX / this.cellSize)
        let cellSelected = this.cells[row][column]
        if(mouseButton === "left" && !cellSelected.isFlagged){
            if(this.mines[0] === undefined) this.startGame(cellSelected)
        }
        this.sendCellClickedToServer(cellSelected.position) 
        this.cellClicked(cellSelected, mouseButton)

    }
    cellClicked = (cell, mouseClicked) => {
        if(mouseClicked === "left" && !cell.isFlagged){
            if(cell.value === 0) this.displayArroundAllZeros(cell)
            if(cell.value === "💣") this.gameOver()
            if(!cell.showed && cell.value !== "💣") {
                this.cellsRemaining--
                this.handleWin()
        }}
        cell.click(mouseClicked)
    }

    displayCanvas(){
        this.cnv = createCanvas(this.width, this.height);
        this.cnv.parent("canvasContainer");
        if(!this.coop)this.cnv.mouseReleased(this.mouseReleased)
    }

    displayFlags = () => {
        this.mines.forEach(mine => {
            mine.value = "🚩"
            mine.showValue()
        })
    }
    /**
     * get all the cells around and executes a function in each cell around the position
     * @param {[Number]} position - The position of the the cell e.g. position = [row, column].
     * @param {Function} fn - function thats executed in each cell around the position, receive as a param one cell around
     * @return {[Cell]} returns an array with the cells around of the position
     */
    displayArroundAllZeros = (cellSelected) =>{
        const zerosCell = [cellSelected]
        const showValueAround = (cell) =>{
            if(!cell.showed && !cell.isFlagged){
                if(cell.value === 0)zerosCell.push(cell)
                cell.showValue()
                this.cellsRemaining--
                this.handleWin()
            }
        }
        for(let cell of zerosCell){
            this.getCellsAroundAndDoInEachCell(cell.position, showValueAround)
        }
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
            row.forEach(cell => {cell.showValue()})
        })
    }
}

export { Game }