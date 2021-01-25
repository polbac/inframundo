import { GlowFilter } from 'pixi-filters'
import TrackBase from '../trask-base'
import { canvasSize, getPixiSprite } from '../../utils'
import {TweenMax} from 'gsap'
import * as PIXI from 'pixi.js'

const LAYOUT_START = 'layoutStart'



export default class Ritmo extends TrackBase{
    constructor(data, pixi, container) {
        super(data, pixi, container, 'xilbaba')

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
        
        this.addAsset(999, assets[1])
        
        this.getAsset(999).sprite.width = 400
        this.getAsset(999).sprite.height = this.getAsset(999).sprite.width / this.getAsset(999).res
        this.getAsset(999).sprite.x = 900
        this.getAsset(999).sprite.y = 200

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

