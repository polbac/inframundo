import * as PIXI from 'pixi.js'
import { canvasSize, getPixiSpriteString } from './utils'
import {ReflectionFilter} from '@pixi/filter-reflection';



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
        this.text = new PIXI.Text('inframundo',{
            fontFamily : 'UnifrakturCook', 
            fontSize: 124,
            fill : 0x0000ff,
            align : 'center'
        });

        this.polbac = new PIXI.Text('p  o  l  b  a  c',{
            fontFamily : 'UnifrakturCook', 
            fontSize: 26,
            fill : 0xffffff,
            align : 'center'
        });

        
        this.sprite.buttonMode = true
        this.sprite.cursor = 'pointer'
        this.sprite.defaultCursor = 'pointer';
        this.sprite.addChild(this.text)
        this.sprite.addChild(this.polbac)
        this.filter = new ReflectionFilter()
        
        this.text.filters = [this.filter]
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
        this.text.y = canvasSize().height / 2 - this.text.height /2
        this.text.x = canvasSize().width / 2 - this.text.width /2

        this.polbac.y = (canvasSize().height / 2 - this.polbac.height /2) - 60
        this.polbac.x = canvasSize().width / 2 - this.polbac.width /2

    }
}