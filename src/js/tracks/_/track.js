import { GlitchFilter, GodrayFilter, CRTFilter } from 'pixi-filters'
import TrackBase from '../trask-base'
import ImageGridTrait from '../traits/image-grid'
import {TweenMax} from 'gsap'

const LAYOUT_START = 'layoutStart'



export default class Track_ extends TrackBase{
    constructor(data, pixi, container) {
        super(data, pixi, container, 'deep in the underscore')

        this.layout = LAYOUT_START
        this.data = data
        this.pixi = pixi
        this.container = container
        this.color1 = 0x000
        this.color2 = 0xf00
        
       
    }

    start() {
        TweenMax.set(this.container, { alpha: 1 })
        this.setAreas([
            { time: 0, call: this.init.bind(this) },
            { time: 0.45, call: this.middle.bind(this) },
            { time: 2.75, call: this.startEnd.bind(this) },
            { time: 3, call: this.finishEnd.bind(this) } ,
            { time: 4, call: this.finish.bind(this) } 
        ])
    }

    init() {
        
        const assets = this.getAssets()
        
        this.setRandomBackgrounds([
            assets[2],
        ])
        this.backgroundIn()

        
    }

    middle() {
        const assets = this.getAssets()

        this.setRandomBackgrounds([
            assets[2],
            assets[3],
        ])

        this.createImageGrid([
            assets[4],
            assets[5],
            assets[6],
            assets[7],
            assets[8],
            assets[9],
            assets[10],
            assets[11],
            assets[12],
        ],
        this.container)
    }

    startEnd() {
        TweenMax.to(this.container, 10, { alpha: 0 })
    }

    finishEnd() {
        this.destroyImageGrid()

        const assets = this.getAssets()

        this.setRandomBackgrounds([
            assets[assets.length - 1]
        ])

        TweenMax.to(this.container, 10, { alpha: 1 })
    }

    finish() {
        TweenMax.to(this.container, 14, { alpha: 0 })
    }

    

    destroy() {
        return new Promise(resolve => {
            TweenMax.to(this.container, 2, { alpha: 0, onComplete: () => {
                this.destroyAreas()
                this.destroyImageGrid()
                this.container.removeChild(this.trackSprite)
                resolve()
            } })
        })
    }
}

Object.assign(Track_.prototype, ImageGridTrait);
