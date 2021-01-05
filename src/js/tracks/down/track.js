import { TwistFilter } from 'pixi-filters'
import TrackBase from '../trask-base'
import { canvasSize } from '../../utils'
import {TweenMax,TimelineMax} from 'gsap'
import * as PIXI from 'pixi.js'

const LAYOUT_START = 'layoutStart'



export default class TrackDown extends TrackBase{
    constructor(data, pixi, container) {
        super(data, pixi, container, 'down')

        this.layout = LAYOUT_START
        this.data = data
        this.pixi = pixi
        this.container = container
        this.color1 = 0xfff
        this.color2 = 0xfff
        
        
    }

    start() {
        TweenMax.set(this.container, { alpha: 1 })
        this.setAreas([
            { time: 0, call: this.init.bind(this) },
            { time: 0.45, call: this.middle.bind(this) },
        ])
    }

    init() {
        TweenMax.set(this.container, { alpha: 1 })

        const assets = this.getAssets()

        this.addAsset(0, assets[1])
        TweenMax.from(this.getAsset(0).sprite, 1, { alpha: 0 })

        this.addAsset(1, assets[0])
        this.getAsset(1).sprite.alpha= 0

        
        
        new TimelineMax({repeat: -1})
            .to(this.getAsset(1).sprite, 5, { alpha: 1 })
            .to(this.getAsset(1).sprite, 5, { alpha: 0 })

        this.addAsset(2, assets[2])
        this.sprite1 = this.getAsset(1).sprite
        this.sprite2 = this.getAsset(2).sprite
        this.sprite1.alpha = 0
        this.sprite2.alpha = 0
        TweenMax.to(this.sprite2, 30, { alpha: 1, delay: 3 })
        TweenMax.to(this.sprite1, 1, { alpha: 1, delay: 5 })
        this.filter1 = new TwistFilter(100, 100, 10)
        this.filter2 = new TwistFilter(100, 100, 10)
        this.filter1.slices = 10
        this.sprite2.filters = [this.filter2]
        this.sprite1.filters = [this.filter1]

        this.resizeAssets()    
    }

    resizeAssets() {
        const canvas = canvasSize()
    
        this.sprite2.width = canvas.width 
        this.sprite2.height = canvas.height 

        this.sprite2.x = canvas.width / 2 - this.sprite2.width / 2
        this.sprite2.y = canvas.height / 2 - this.sprite2.height / 2

        this.sprite1.width = canvas.width 
        this.sprite1.height = canvas.height 

        this.sprite1.x = canvas.width / 2 - this.sprite1.width / 2
        this.sprite1.y = canvas.height / 2 - this.sprite1.height / 2
    }

    render() {
        const canvas = canvasSize()
        if (this.filter1) {
            this.filter1.angle = 10
            this.filter1.radius += 0.5
            this.filter1.offset = new PIXI.Point(canvas.width/2, canvas.height/2)
        }
        if (this.filter2) {
            this.filter2.angle = 10
            this.filter2.radius += 0.5
            this.filter2.offset = new PIXI.Point(canvas.width/2, canvas.height/2)
        }
    }

    middle() {
        const assets = this.getAssets()
    }

    destroy() {
        return new Promise(resolve => {
            TweenMax.to(this.container, 2, { alpha: 0, onComplete: () => {
                this.container.removeChild(this.trackSprite)
                this.removeAssets()
                resolve()
            } })
        })
    }
}

