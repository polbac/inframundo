import { GlitchFilter, GodrayFilter, CRTFilter } from 'pixi-filters'
import TrackBase from '../trask-base'
import ImageGridTrait from '../traits/image-grid'
import {TweenMax} from 'gsap'
import * as PIXI from 'pixi.js-legacy' 

const LAYOUT_START = 'layoutStart'



export default class Track_ extends TrackBase{
    constructor(data, pixi, container, shape) {
        super(data, pixi, container, '', shape)

        this.layout = LAYOUT_START
        this.data = data
        this.pixi = pixi
        this.container = container
        this.color1 = 0x000
        this.color2 = 0xf00
        
       
    }

    start() {
        const path = '/assets/placa.png'
        
        const textureInframundo = PIXI.Texture.from(path);
        this.inframundoSprite = new PIXI.Sprite(textureInframundo)
        this.inframundoSprite.alpha = 0
        const imageInframundo = new Image()
        imageInframundo.onload = () => {
            this.resize()
            TweenMax.to(this.inframundoSprite, 2, { alpha: 1 })
            TweenMax.to(this.inframundoSprite, 2, { alpha: 0, delay: 8, onComplete() {
                if (this.inframundoSprite) {
                    this.container.removeChild(this.inframundoSprite)
                    this.inframundoSprite = null
                }
            } })
            
        }
        imageInframundo.src = path
        
        this.container.addChild(this.inframundoSprite)
        this.inframundoSprite.zIndex =  999999

        TweenMax.to(this.inframundoSprite, 1, { alpha: 1 })
        

        TweenMax.set(this.container, { alpha: 1 })
        this.setAreas([
            { time: 0, call: this.init.bind(this) },
            { time: 0.45, call: this.middle.bind(this) },
            { time: 1.25, call: this.middle2.bind(this) },
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
        console.log('middle')
        const assets = this.getAssets()

        this.setRandomBackgrounds([
            assets[2],
            assets[3],
        ])
        this.destroyImageGrid()

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
    middle2() {
        this.destroyImageGrid() 
        const assets = this.getAssets()

        this.setRandomBackgrounds([
            assets[14],
            assets[16],
        ])
        console.log('middle2')
        this.createImageGrid([
            assets[15],
            assets[15],
            assets[16],
            assets[17],
            assets[18],
            assets[19],
            assets[20],
            assets[21],
            assets[22],
            assets[23],
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
            assets[13]
        ])

        TweenMax.to(this.container, 10, { alpha: 1 })
    }

    finish() {
        TweenMax.to(this.container, 14, { alpha: 0 })
    }

    

    destroy() {
        console.log('destroy')
        return new Promise(resolve => {
            if (this.inframundoSprite) {
                TweenMax.killTweensOf(this.inframundoSprite)
            }
            TweenMax.to(this.container, 2, { alpha: 0, onComplete: () => {
                if (this.inframundoSprite) {
                    if (this.container) {
                        this.container.removeChild(this.inframundoSprite)
                    }
                    this.inframundoSprite = null
                }
                this.destroyPattern()
                this.destroyAreas()
                this.destroyImageGrid()
                this.destroyBackground()
                this.container.removeChild(this.trackSprite)
                resolve()
            } })
        })
    }
}

Object.assign(Track_.prototype, ImageGridTrait);
