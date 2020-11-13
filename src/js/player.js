import * as PIXI from 'pixi.js'
import { TweenMax } from 'gsap/all'
import { canvasSize } from './utils'
import { Tween } from 'gsap/gsap-core'

const SIZE = 700
const INSISE_SIZE = SIZE * 0.7
const TOTAL_SONGS = 5

const path = [
    0,0, 
    SIZE/2,SIZE, 
    SIZE,0,
    0, INSISE_SIZE, 
    SIZE, INSISE_SIZE, 
    0,0
]

const BUTTON_SIZE = 50

const triangule = [
    0, 0,
    BUTTON_SIZE, BUTTON_SIZE/2,
    0, BUTTON_SIZE
]


export class Player{
    constructor(stage) {
        this.levitation = 0
        this.currentIndexSong = 2
        this.playing = false
        this.percent = 0
        this.stage = stage
        this.playerSprite = new PIXI.Sprite();
        this.graphicsBackground = new PIXI.Graphics();
        this.graphics = new PIXI.Graphics();
        this.button = new PIXI.Graphics();
        this.buttonSprite = new PIXI.Sprite();
        
        this.graphicsBackground.pivot.set(SIZE/2, SIZE/2)
        this.graphics.pivot.set(SIZE/2, SIZE/2)
        
        this.playerSprite.addChild(this.graphicsBackground);
        this.playerSprite.addChild(this.graphics);
        this.playerSprite.addChild(this.buttonSprite);
        
        stage.addChild(this.playerSprite)

        this.graphicsBackground.lineStyle(1, 0x333333, 1);
        
        
        this.buttonSprite.addChild(this.button)

        this.buttonSprite.interactive = true

        this.graphicsBackground.alpha = 0
        this.graphics.alpha = 0

        this.buttonSprite.mouseover = () => {
            TweenMax.to(this.graphics, 1, { alpha: 1 })
            TweenMax.to(this.graphicsBackground, 1, { alpha: 1 })
        }

        this.buttonSprite.mouseout = () => {
            TweenMax.to(this.graphics, 1, { alpha: 0 })
            TweenMax.to(this.graphicsBackground, 1, { alpha: 0 })
        }

        this.buttonSprite.tap = this.buttonSprite.click = this.tooglePlay.bind(this)

        this.draw()
    }

    tooglePlay() {
        this.playing = !this.playing
        this.draw()
        this.percent = 0
    }

    draw() {
        
        this.graphicsBackground.drawPolygon(path);

        this.graphicsBackground.x = canvasSize().width / 2
        this.graphicsBackground.y = canvasSize().height / 2
        this.graphics.x = canvasSize().width / 2 
        this.graphics.y = canvasSize().height / 2
        
        this.buttonSprite.x = canvasSize().width / 2 - BUTTON_SIZE / 2
        this.buttonSprite.y = canvasSize().height / 2 - BUTTON_SIZE / 2

        this.button.clear()

        if (this.playing) {
            this.button.beginFill(0xfff00, 1)
            this.button.drawPolygon(triangule)
            this.button.endFill()
        } else {
            this.button.beginFill(0xfff00, 1)
            this.button.drawRect(0, 0, BUTTON_SIZE * .4, BUTTON_SIZE)
            this.button.drawRect(BUTTON_SIZE *.5, 0, BUTTON_SIZE * .4, BUTTON_SIZE)
            this.button.endFill()
        }
    }

    render() {
        this.percent += 0.001
        
        if (this.percent >= 1) {
            this.percent = 0
            this.currentIndexSong++
        }

        const minmalPath = path.slice(0, this.currentIndexSong * 2)
        this.graphics.clear()
        this.graphics.lineStyle(1, 0xfff00, 1);
        let from = []
        minmalPath.forEach((l, i) => {
            if (i % 2 === 0) {
                this.graphics
                    .moveTo(minmalPath[i - 2], minmalPath[i - 1])
                    .lineTo(minmalPath[i], minmalPath[i + 1]);
                from = [minmalPath[i], minmalPath[i + 1]]
            }
        })

        const currentPathIndex = (this.currentIndexSong) * 2
        
        const x2 = from[0] + this.percent * (path[currentPathIndex]-from[0]);
        const y2 = from[1] + this.percent * (path[currentPathIndex+1]-from[1]);

        this.graphics
            .lineTo(
                x2, y2 
            );
        this.levitation += 0.001
        this.playerSprite.y = Math.sin(this.levitation) * 50
    }
}