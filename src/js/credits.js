import * as PIXI from 'pixi.js'
import { canvasSize, getPixiSpriteString } from './utils'



export default class Credits{
    constructor(pixi, container) {
        this.pixi = pixi
        this.container = container
        this.created = false

        //document.getElementById("credits").onclick =  this.show.bind(this)
        
    }

    show() {
        if (this.created) return
        this.created = true
        this.sprite = new PIXI.Container()
        this.rect = new PIXI.Graphics();
        this.rect.beginFill(0x0000ff);
        this.sprite.addChild(this.rect)
        this.container.addChild(this.sprite)
        this.sprite.interactive = true
        this.sprite.on('click', this.destroy.bind(this))

        this.title = new PIXI.Text('A B O U T',{
            fontFamily : 'UnifrakturCook', 
            fontSize: 24,
            fill : 0xffffff,
            align : 'left'
        });

        this.body = new PIXI.Text(`
        Lorem ipsum dolor sit amet,\n
        Lorem ipsum dolor sit amet,\n
        Lorem ipsum dolor sit amet,\n
        Lorem ipsum dolor sit amet,\n
        Lorem ipsum dolor sit amet,\n
        Lorem ipsum dolor sit amet,\n
        Lorem ipsum dolor sit amet,\n
        Lorem ipsum dolor sit amet,\n


        `,{
            fontFamily : 'Oswald', 
            fontSize: 16,
            fill : 0xffffff,
            align : 'left',
            fontWeight: 300,
        });


        this.title.x = 20
        this.title.y = 20

        this.body.x = 70
        this.body.y = 100

        this.sprite.addChild(this.title)
        this.sprite.addChild(this.body)

        this.resize()

        return false
        
    }

    destroy(){
        this.created = false
        this.container.removeChild(this.sprite)
    }

    resize() {
        const canvas = canvasSize()
        this.rect.drawRect(0, 0, canvas.width, canvas.height);
        

    }
}