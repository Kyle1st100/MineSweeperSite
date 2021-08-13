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
        this.showed = false
        this.isFlagged = false
    }
    showBlocked(){
        fill(255,255,255)
        rect(this.x,this.y, this.width, this.height)
    }
    click(mouseClicked){
        if(this.isFlagged || mouseClicked === "right"){
            this.toggleFlag()
        } else {
            if(mouseClicked === "left"){
                this.showValue()
            }
        }
    }
    
    toggleFlag = () =>{
        if(this.showed) return
        this.isFlagged = !this.isFlagged
        if(this.isFlagged){
            textSize(this.width/1.3);
            textAlign(CENTER, CENTER)
            text("🚩", this.x + this.width/2, this.y + this.height/2);
        }else {
            this.showBlocked()
        }
        
    }
    showValue = () => {
        if(this.showed) return
        this.showed = true
        textSize(this.width);
        textAlign(CENTER, CENTER)
        switch (this.value) {     
            case 0:
                fill(172, 167, 167);
                rect(this.x,this.y, this.width, this.height)
                break;
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
                fill(255,0,0)
                rect(this.x,this.y, this.width, this.height)
                break;
            case '🚩':
                textSize(this.width/1.3);
                break;
            default:
                fill(255 , 255, 255) 
                break;
        }
        text(this.value.toString(), this.x + this.width/2, this.y + this.height/2);
    }
}
export { Cell }