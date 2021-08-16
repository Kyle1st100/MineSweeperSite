import { Game } from "../modules/Game.js"

const $ = (selector) => document.querySelector(selector)
const $timer = $('.timer > .retro')
const $points = $('.points > .retro')
const $emoji = $('.start')
const game = new Game({ $timer, $points, $emoji, rows: 20, columns: 25, mines: 50, coop: true})

window.setup = () => {
    game.displayCanvas()
    game.generateCells()
    game.setupConnection()
    $('.start').onclick = () =>{
        game.restart()
        game.sendRestart()
    }
}
  
window.draw = () => {

}