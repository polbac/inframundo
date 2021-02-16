import * as PIXI from 'pixi.js'
import { canvasSize, getPixiSpriteString } from './utils'
import {ReflectionFilter} from '@pixi/filter-reflection';
import {TweenMax} from 'gsap';



export default class Intro{
    constructor(pixi, container) {
        this.pixi = pixi
        this.container = container
        this.created = true
        this.draw()
        
    }

    destroy(){
        this.created = false
        this.container.removeChild(this.sprite)
    }

    draw() {
        this.sprite = new PIXI.Container()
        this.sprite.interactive = true
        this.container.addChild(this.sprite)
        
        
        this.sprite.buttonMode = true
        this.sprite.cursor = 'pointer'
        this.sprite.defaultCursor = 'pointer';
        const path = '/assets/inframundo.png'
        
        const texture = PIXI.Texture.from(path);
        this.inframundoSprite = new PIXI.Sprite(texture)
        this.inframundoSprite.alpha = 0
        const image = new Image()
        image.onload = () => {
            TweenMax.to(this.inframundoSprite, 1, { alpha: 1 })
            this.resize()
        }
        image.src = path

        this.sprite.addChild(this.inframundoSprite)
        this.filter = new ReflectionFilter()
        
        this.sprite.filters = [this.filter]
        this.filter.waveLength = [15, 5]
        this.filter.alpha = [1, 1]
        this.filter.boundary = 0.66
        this.filter.mirror = false
        this.resize()
    }

    render() {
        if (!this.created) return
        this.filter.time += 0.025
    }

    resize() {
        this.inframundoSprite.x = canvasSize().width / 2 -this.inframundoSprite.width / 2
        this.inframundoSprite.y = canvasSize().height / 2 -this.inframundoSprite.height / 2

    }
}