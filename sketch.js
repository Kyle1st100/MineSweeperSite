
import { Game } from "./modules/Game.js"

const $ = (selector) => document.querySelector(selector)
const $timer = $('.timer > .retro')
const $points = $('.points > .retro')
const game = new Game({ $timer, $points})

window.setup = () => {
    game.displayCanvas()
    game.generateCells()
    $('.start').onclick = () =>{
        game.restart()
    }

}
  
window.draw = () => {

}