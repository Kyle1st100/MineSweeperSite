import { Game } from "../modules/Game.js"

const $ = (selector) => document.querySelector(selector)
const $timer = $('.timer > .retro')
const $points = $('.points > .retro')
const $emoji = $('.start')
const game = new Game({ $timer, $points, $emoji, rows: 20, columns: 25, mines: 60})

window.setup = () => {
    game.displayCanvas()
    game.generateCells()
    $('.start').onclick = () =>{
        game.restart()
    }

}
  
window.draw = () => {

}