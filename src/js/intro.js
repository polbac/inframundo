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
        this.enterSprite = new PIXI.Container()
        this.dontSupportSprite = new PIXI.Container()
        this.sprite.addChild(this.enterSprite)
        

        const text = new PIXI.Text('INGRESAR A EXPERIENCIA',{
            fontFamily : 'Arial', fontSize: 13, fill : 0xffffff, align : 'center'});
        
        this.dontSuppoerText = new PIXI.Text(`INGRESA DESDE UNA COMPUTADORA DESKTOP
            PARA ACCEDER A EXPERIENCIA`,{
                fontFamily : 'Arial', fontSize: 13, fill : 0xffffff, align : 'center'});
        this.sprite.addChild(this.dontSuppoerText)
        text.y = 7
        text.x = 150 - text.width / 2

        var graphics = new PIXI.Graphics();
        graphics.beginFill(0x0000ff);

        // draw a rectangle
        graphics.drawRect(0, 0, 300, 30);

        this.enterSprite.addChild(graphics);
        
        this.container.addChild(this.sprite)
        this.enterSprite.addChild(text)
        
        this.enterSprite.interactive = true
        this.enterSprite.buttonMode = true
        this.enterSprite.cursor = 'pointer'
        this.enterSprite.defaultCursor = 'pointer';
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
        
        this.inframundoSprite.filters = [this.filter]
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

        this.enterSprite.x = canvasSize().width / 2 -this.enterSprite.width / 2
        this.enterSprite.y = (canvasSize().height / 2 -this.enterSprite.height / 2) + 100

        this.enterSprite.x = canvasSize().width / 2 -this.enterSprite.width / 2
        this.enterSprite.y = (canvasSize().height / 2 -this.enterSprite.height / 2) + 100

        

        this.dontSuppoerText.x = canvasSize().width / 2 -this.dontSuppoerText.width / 2
        this.dontSuppoerText.y = (canvasSize().height / 2 -this.dontSuppoerText.height / 2) + 100

        if (canvasSize().width < 700) {
            this.dontSuppoerText.visible = true
            this.enterSprite.visible = false
        } else{
            this.dontSuppoerText.visible = false
            this.enterSprite.visible = true  
        }

    }
}