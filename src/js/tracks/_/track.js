import { GlitchFilter, GodrayFilter, CRTFilter } from 'pixi-filters'
import TrackBase from '../trask-base'
import ImageGridTrait from '../traits/image-grid'

const LAYOUT_START = 'layoutStart'



export default class Track_ extends TrackBase{
    constructor(data, pixi, container) {
        super(data, pixi, container, 'deep in underscore')

        this.layout = LAYOUT_START
        this.data = data
        this.pixi = pixi
        this.container = container
        this.color1 = 0x000
        this.color2 = 0xf00
        
        
        setInterval(() => {
            
        }, 100)
        this.setAreas([
            { time: 0, call: this.init.bind(this) },
            { time: 0.3, call: this.middle.bind(this) }
        ])
    }

    init() {
        const assets = this.getAssets()

        this.setRandomBackgrounds(assets)

        
    }

    middle() {
        this.createImageGrid(this.assets, this.container)
    }

    start() {
        
    }

    changeVideo() {

    }
}

Object.assign(Track_.prototype, ImageGridTrait);
