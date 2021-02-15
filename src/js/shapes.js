import * as PIXI from 'pixi.js'
import { OldFilmFilter } from 'pixi-filters'
import { canvasSize, getPixiSprite } from './utils'
import { TweenMax } from 'gsap/gsap-core'

function randomNoRepeats(array) {
    var copy = array.slice(0);
    return function() {
      if (copy.length < 1) { copy = array.slice(0); }
      var index = Math.floor(Math.random() * copy.length);
      var item = copy[index];
      copy.splice(index, 1);
      return item;
    };
  }

export default class Shapes {
    constructor(container, data) {
        this.container = container
        this.graphic = new PIXI.Graphics()

        this.container.addChild(this.graphic)
        this.data = data[0].data.shapes.imagenes.value
        this.shapes = []
        this.show()
        this.change()
        setInterval(this.change.bind(this), 50)
        
        this.old = new OldFilmFilter({
            sepia: 0,
            noise: 0.3,
            scratch: 1,
            vignetting: 0,
            scratchDensity: 1
        })
        
        this.graphic.filters = [this.old]
        
        
    }

    render() {
        if (this.graphic) {
            this.old.seed = Math.random()
            this.graphic.clear()
            //this.graphic.beginFill(0xffffff);
            this.graphic.alpha = 0.75
            this.graphic.drawRect(0, 0, canvasSize().width, canvasSize().height);
        }

    }

    change() {
        this.shapes.forEach(m => {
            this.container.removeChild(m)
        })

        this.shapes = []

        const total = Math.ceil(Math.random() * 5)

        if (Math.random() > 0.5) return

        for (let index = 0; index < total; index++) {
            const sh = randomNoRepeats(this.data)()
            const media = getPixiSprite(sh)
            media.sprite.width = 60
            media.sprite.height = media.width * 60 / media.height
            media.sprite.blendMode = PIXI.BLEND_MODES.ADD
            this.container.addChild(media.sprite)
            media.sprite.x = Math.random() * canvasSize().width
            media.sprite.y = Math.random() * canvasSize().height        
            this.shapes.push(media.sprite)    
        }
    }

    show() {
        TweenMax.to(this.container, 2, { alpha: 1})
    }

    hide() {
        console.log('hide')
        TweenMax.to(this.container, 2, { alpha: 0})
    }
}