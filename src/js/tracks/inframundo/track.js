import { MultiColorReplaceFilter } from 'pixi-filters'
import TrackBase from '../trask-base'
import { canvasSize, getPixiSprite } from '../../utils'
import {TweenMax} from 'gsap'
import * as PIXI from 'pixi.js'

const LAYOUT_START = 'layoutStart'



export default class Inframundo extends TrackBase{
    constructor(data, pixi, container) {
        super(data, pixi, container, 'inframundo')

        this.layout = LAYOUT_START
        this.data = data
        this.pixi = pixi
        this.container = container
        this.color1 = 0xfff
        this.color2 = 0xfff
        this.trackSprite.zIndex = 0
    }

    start() {
        TweenMax.set(this.container, { alpha: 1 })

        this.setAreas([
            { time: 0, call: this.init.bind(this) },
            { time: 0.135, call: this.effect.bind(this) },
            { time: 0.2, call: this.rythm.bind(this) },
            { time: 0.3, call: this.rythm2.bind(this) },
            { time: 0.35, call: this.horse.bind(this) },
            { time: 0.45, call: this.pattern.bind(this) },
            { time: 0.5, call: this.patternDirection({x: -3, y: 3}).bind(this) },
            { time: 0.55, call: this.patternDirection({x: 3, y: 3}).bind(this) },
            { time: 0.60, call: this.patternDirection({x: 3, y: -3}).bind(this) },
            { time: 0.65, call: this.patternDirection({x: 1, y: 0}).bind(this) },
            { time: 0.70, call: this.patternDirection({x: 5, y: 5}).bind(this) },
            { time: 0.75, call: this.patternDirection({x: 0, y: -10}).bind(this) },
            { time: 0.80, call: this.patternDirection({x: 2, y: -5}).bind(this) },
            { time: 0.85, call: this.patternDirection({x: 3, y: 0}).bind(this) },
            { time: 0.9, call: this.pattern2.bind(this) },
            { time: 1.15, call: this.patternDirection2({x: 0, y: 2}).bind(this) },
            { time: 1.39, call: this.silence.bind(this) },
            { time: 2.02, call: this.back.bind(this) },
            { time: 2.03, call: this.rythm2.bind(this) },
            { time: 2.2, call: this.pattern3.bind(this) },
            { time: 2.7, call: this.horse.bind(this) },
            { time: 3, call: this.pattern4.bind(this) },
            { time: 3.9, call: this.patternDirection4({x: -1, y: -1}).bind(this) },
            { time: 3.05, call: this.patternDirection4({x: -1, y: 1}).bind(this) },
            { time: 3.14, call: this.pattern5.bind(this) },
            { time: 3.25, call: this.patternDirection5({x: 1, y: 1}).bind(this) },
            { time: 3.35, call: this.patternDirection5({x: -1, y: 2}).bind(this) },
            { time: 3.55, call: this.patternDirection5({x: 1, y: 2}).bind(this) },
            { time: 3.58, call: this.patternDirection4({x: 1, y: 1}).bind(this) },
            { time: 3.65, call: this.patternDirection5({x: -1, y: 2}).bind(this) },
            { time: 3.75, call: this.patternDirection5({x: -1, y: 0}).bind(this) },
            { time: 4.02, call: this.videoEnd0.bind(this) },
            { time: 4.07, call: this.videoEnd.bind(this) },
            { time: 4.27, call: this.end.bind(this) },
        ])
    }

    effect() {
        const assets = this.getAssets()
        this.addAsset(9999, assets[1])
        
        const canvas = canvasSize()
        this.platform = this.getAsset(9999).sprite
     
        const platformRes = this.platform.width / this.platform.height
        this.platform.width = canvas.width * .25
        this.platform.height = this.platform.width / platformRes
        this.platform.x = canvas.width/2 - this.platform.width/2
        this.platform.y = canvas.height/2 - this.platform.height/2

    }

    init() {
        const assets = this.getAssets()
        TweenMax.set(this.container, { alpha: 1 })

        this.setRandomBackgrounds([
            assets[8],
        ], 500)
       
    }

    rythm() {
        this.trackSprite.filters = []
        this.destroyBackground()
        this.removeAssets()

        const assets = this.getAssets()
        
        this.setRandomBackgrounds([
            assets[0],
            assets[1],
            assets[2],
            assets[10],
        ], 500)
    }
    
    horse() {
        this.removeAssets()

        if (this.intervalSQ) clearInterval(this.intervalSQ)

        const assets = this.getAssets()

        this.hors = getPixiSprite(assets[3]).sprite
        this.trackSprite.addChild(this.hors)
        this.hors.zIndex = 1000000

        const canvas = canvasSize()
        const platformRes = this.hors.width / this.hors.height
        this.hors.width = canvas.width * 0.5
        this.hors.height = this.hors.width / platformRes
        this.hors.x = canvas.width/2 - this.hors.width/2
        this.hors.y = canvas.height/2 - this.hors.height/2

        TweenMax.to(this.hors, 2, { x: 1200, alpha: 0, delay: 4 })
    }

    rythm2() {
        const assets = this.getAssets()
        const medias = [
            assets[0],
            assets[1],
            assets[2],
            assets[10],
        ]
        
        let current = 0

        this.intervalSQ = setInterval(() => {
            this.removeAssets()
            
            if (Math.random() > 0.5) return

            const canvas = canvasSize()
            
            const media = medias[current]

            this.addAsset(9999, media)
            
            this.platform = this.getAsset(9999).sprite

            const platformRes = this.platform.width / this.platform.height
            this.platform.width = canvas.width * (0.5 + (Math.random()*0.5))
            this.platform.height = this.platform.width / platformRes
            this.platform.x = canvas.width/2 - this.platform.width/2
            this.platform.y = canvas.height/2 - this.platform.height/2


            current++ 

            if (current === medias.length) {
                current = 0
            }
        }, 300)
            
    }

    pattern() {
        const assets = this.getAssets()
        this.createPattern(assets[3], 250, {x: 3, y: 3}, 99)
        this.resizeAssets()
    }


    pattern2() {
        const assets = this.getAssets()
        this.createPattern(assets[4], 350, {x: 0, y: -1}, 90)
        this.resizeAssets()
    }

    pattern3() {
        const assets = this.getAssets()
        this.createPattern(assets[6], 750, {x: 0, y: -1}, 80)
        this.resizeAssets()
    }

    patternDirection3(d) {
        return () =>  this.setPatternDirection(d, 80)
    }
    

    pattern4() {
        const assets = this.getAssets()
        this.createPattern(assets[3], 300, {x: 0, y: -1}, 99)
        this.resizeAssets()
    }

    patternDirection4(d) {
        return () =>  this.setPatternDirection(d, 99)
    }

    pattern5() {
        const assets = this.getAssets()
        this.createPattern(assets[5], 200, {x: 0, y: -1}, 100)
        this.resizeAssets()
    }

    patternDirection5(d) {
        return () =>  this.setPatternDirection(d, 100)
    }

    patternDirection(d) {
        return () =>  this.setPatternDirection(d, 99)
    }
    
    patternDirection2(d) {
        return () =>  this.setPatternDirection(d, 90)
    }
    


    platform() {

        this.addAsset(100, this.getAssets()[4])
        
        this.resizeAssets()

    }

    silence() {
        const assets = this.getAssets()
        this.destroyPattern()
        this.filter1 = new MultiColorReplaceFilter(
            [
              [0x8e1d1d, 0xd91919],
              [0xeb29, 0xffc3],
              [0x165791, 0xffff00],
            ],
            0.5
          )
        
        this.setRandomBackgrounds([
            assets[9],
        ], 500)

        this.trackSprite.filters = [this.filter1]
        

    }

    back() {
        const assets = this.getAssets()

        this.trackSprite.filters = []
        this.destroyBackground()

        this.setRandomBackgrounds([
            assets[0],
            assets[1],
            assets[2],
            assets[10],
        ], 500)
        
    }
    videoEnd0(){
        TweenMax.to(this.container, 2, { alpha: 0 })
    }

    videoEnd() {
        if(this.intervalSQ) clearInterval(this.intervalSQ)
        this.removeAssets()

        const assets = this.getAssets()
        this.destroyPattern()

        TweenMax.to(this.container, 2, { alpha: 1 })
        
        this.setRandomBackgrounds([
            assets[9],
        ], 500)

        

    }

    end() {
        TweenMax.to(this.container, 3, { alpha: 0 })

    }

    resizeAssets() {
        const canvas = canvasSize()
        const asset = this.getAsset(9)

        if (asset) {
            const platform = asset.sprite
            const platformRes = asset.res
            platform.width = canvas.width * .45
            platform.height = platform.width / platformRes
            platform.y = canvas.height - platform.height - 150
            platform.x = 50
        }
    }

    render() {
        this.renderPattern()
    }

    

    destroy() {
        this.destroyPattern()
        this.destroyBackground()
        if(this.intervalSQ) clearInterval(this.intervalSQ)
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

