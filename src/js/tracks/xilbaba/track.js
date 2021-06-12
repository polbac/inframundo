import { GlowFilter } from 'pixi-filters'
import TrackBase from '../trask-base'
import { canvasSize, getPixiSprite } from '../../utils'
import {TweenMax} from 'gsap'
import * as PIXI from 'pixi.js-legacy'

const LAYOUT_START = 'layoutStart'



export default class Ritmo extends TrackBase{
    constructor(data, pixi, container, shape) {
        super(data, pixi, container, 'xlbaba', shape)

        this.layout = LAYOUT_START
        this.data = data
        this.pixi = pixi
        this.container = container
        this.color1 = 0xfff
        this.color2 = 0xfff
        
        this.clones = []
        this.follow = false
    }

    start() {
        this.setAreas([
            { time: 0, call: this.init.bind(this) },
        ])
        TweenMax.set(this.container, { alpha: 0 })
        TweenMax.to(this.container, 1, { alpha: 1 })

        const assets = this.getAssets()
        
        

        this.setRandomBackgrounds([
            assets[0],
        ], 500)
    }
    
    init() {

    }
    
    destroy() {
        this.destroyPattern()
        this.destroyBackground()

        this.removeAssets()
        return new Promise(resolve => {
            TweenMax.to(this.container, 2, { alpha: 0, onComplete: () => {
                this.container.removeChild(this.trackSprite)
                this.removeAssets()
                resolve()
            } })
        })
    }
}

