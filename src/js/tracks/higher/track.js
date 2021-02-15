
import TrackBase from '../trask-base'
import {GlowFilter} from '@pixi/filter-glow';
import {PixelateFilter} from '@pixi/filter-pixelate';
import {CRTFilter} from '@pixi/filter-crt';

import { canvasSize, getPixiSprite } from '../../utils'
import {TweenMax} from 'gsap'
import * as PIXI from 'pixi.js'

const LAYOUT_START = 'layoutStart'


export default class Higher extends TrackBase{
    constructor(data, pixi, container) {
        super(data, pixi, container, 'higher')

        this.layout = LAYOUT_START
        this.data = data
        this.pixi = pixi
        this.container = container
        this.color1 = 0xfff
        this.color2 = 0xfff
        
        this.clones = []
        this.follow = false
        this.counter = 0

        this.trackSprite.zIndex = 10
    }

    start() {
        this.setAreas([
            { time: 0, call: this.fire.bind(this) },
            { time: 0.05, call: this.hearth.bind(this) },
            { time: 0.1, call: this.shape1.bind(this) },
            { time: 0.12, call: this.backgroundScene.bind(this) },
            { time: 0.45, call: this.destroyFire.bind(this) },
            { time: 0.48, call: this.wonder.bind(this) },
            { time: 0.8, call: this.shape2.bind(this) },
            { time: 1.13, call: this.backgroundScene2.bind(this) },
            { time: 1.2, call: this.shape3.bind(this) },
            { time: 1.21, call: this.destroyHearth1.bind(this) },
            { time: 1.4, call: this.shape4.bind(this) },
            { time: 2, call: this.lasers.bind(this) },
            { time: 2.25, call: this.backgroundScene3.bind(this) },
            { time: 2.27, call: this.destroyHearth2.bind(this) },
            { time: 2.46, call: this.video.bind(this) },
            { time: 2.74, call: this.videoStart.bind(this) },
            { time: 3.71, call: this.destroyHearth3.bind(this) },
            { time: 3.72, call: this.gameOver.bind(this) },
            { time: 3.78, call: this.end.bind(this) },
        ])

        TweenMax.set(this.container, { alpha: 0 })
        TweenMax.to(this.container, 1, { alpha: 1 })

        this.crt = new CRTFilter({
            vignettingAlpha: 0.5
        })
        this.container.filters = [new PixelateFilter([2,2]), this.crt]

        
    }

    lasers() {
        this.laserCounter = 0
        this.lasersContainer = []
        this.laserSprite = new PIXI.Sprite()
        this.container.addChild(this.laserSprite)
        this.lineGraph = new PIXI.Graphics();
        this.laserSprite.addChild(this.lineGraph);
        this.laserSprite.zIndex = 60

        this.laserSprite.filters = [new GlowFilter({
            color: 0xf3149d
        })]

        const MARGIN = 100

        for (let index = 0; index < 70; index++) {
            this.lasersContainer.push({
                x1: MARGIN + (Math.random()*(canvasSize().width - MARGIN)),
                x2: MARGIN + (Math.random()*(canvasSize().width - MARGIN)),
                y1: MARGIN + (Math.random()*(canvasSize().height - MARGIN)),
                y2: MARGIN + (Math.random()*(canvasSize().height - MARGIN)),
            })
            
        }
    }

    destroyHearth1() {
        this.removeAsset(500)
    }

    destroyHearth2() {
        this.removeAsset(501)
    }

    destroyHearth3() {
        this.removeAsset(502)
    }

    hearth() {
        const h1 = {
            ...this.getAssets()[14]
        }

        const h2 = {
            ...this.getAssets()[14]
        }

        const h3 = {
            ...this.getAssets()[14]
        }

        this.addAsset(500, h1)
        this.getAsset(500).sprite.width = 25
        this.getAsset(500).sprite.height = 25
        this.getAsset(500).sprite.y = 10

        this.addAsset(501, h2)
        this.getAsset(501).sprite.width = 25
        this.getAsset(501).sprite.height = 25
        this.getAsset(501).sprite.y = 10

        this.addAsset(502, h3)
        this.getAsset(502).sprite.width = 25
        this.getAsset(502).sprite.height = 25
        this.getAsset(502).sprite.y = 10
    }

    destroyFire(){
        if (!this.fireContainer) return
        this.fireContainer.forEach(fire => {
            TweenMax.killTweensOf(fire)
            fire.stop()
            this.container.removeChild(fire)
            fire.destroy()
        })

        this.fireContainer = null
    }

    videoStart() {

    }

    end(){
        this.destroyBackground()
        TweenMax.to(this.container, 1, { alpha: 0 })
    }

    video() {
        if (this.laserSprite) {
            this.container.removeChild(this.laserSprite)
            this.laserSprite = null
        }

        clearTimeout(this.wonderTimeout)
        TweenMax.killTweensOf(this.animatedWonder)
        this.animatedWonder.stop()
        this.container.removeChild(this.animatedWonder)
        this.animatedWonder.destroy()
        this.animatedWonder = null
        this.removeAssets()
        this.setBackground(this.getAssets()[11])
        this.backgroundIn()
    }

    gameOver() {
        this.gameOverSprite = this.getAssets()[7]
        this.addAsset(20, this.gameOverSprite)
        this.getAsset(20).sprite.x = (canvasSize().width - this.getAsset(20).width) / 2
        this.getAsset(20).sprite.y = (canvasSize().height - this.getAsset(20).height) / 2
        TweenMax.to(this.getAsset(20).sprite, 1, {
            alpha: 0,
            repeat: -1
        })
    }

    shape1() {
        this.addAsset(10, this.getAssets()[4])
        this.getAsset(10).sprite.x = (canvasSize().width - this.getAsset(10).width) / 2
        this.getAsset(10).sprite.y = (canvasSize().height - this.getAsset(10).height) / 2
    }

    shape2() {
        this.removeAsset(10)
        this.addAsset(10, this.getAssets()[3])
        this.getAsset(10).sprite.x = (canvasSize().width - this.getAsset(10).width) / 2
        this.getAsset(10).sprite.y = (canvasSize().height - this.getAsset(10).height) / 2
    }

    shape3() {
        console.log('shape3')
        this.removeAsset(10)
        this.addAsset(10, this.getAssets()[1])
        this.getAsset(10).sprite.x = (canvasSize().width - this.getAsset(10).width) / 2
        this.getAsset(10).sprite.y = (canvasSize().height - this.getAsset(10).height) / 2
    }

    shape4() {
        console.log('shape4')
        this.removeAsset(10)
        this.addAsset(10, this.getAssets()[2])
        this.getAsset(10).sprite.x = (canvasSize().width - this.getAsset(10).width) / 2
        this.getAsset(10).sprite.y = (canvasSize().height - this.getAsset(10).height) / 2
    }

    fire() {

        PIXI.Loader.shared
            .add('fire', '/assets/fire.json')
            .add('king', '/assets/king.json')
            .add('wonder', '/assets/wonder.json')
            .load((loader, resources) => {
                this.resources = resources
                if (resources.fire && !this.animatedFire) {
                    this.animatedFire = new PIXI.AnimatedSprite(resources.fire.spritesheet.animations["fire8_64"]);
                    this.createFireScene()
                }

                if (resources.king && !this.animatedKing) {
                    this.animatedKing = new PIXI.AnimatedSprite(resources.king.spritesheet.animations["Daco_5221354"]);
                }

                if (resources.wonder && !this.animatedWonder) {
                    this.animatedWonder = new PIXI.AnimatedSprite(resources.wonder.spritesheet.animations["klipartz"]);
                }
            });

    }

    createFireScene() {
        this.fireContainer = []
        for (let index = 0; index < 150; index++) {
            
            const fire = new PIXI.AnimatedSprite(this.resources.fire.spritesheet.animations["fire8_64"]);
            fire.play()
            fire.x = 200 + Math.random() * canvasSize().width - 200
            fire.y = 300 + Math.random() * canvasSize().height
            this.container.addChild(fire)
            this.fireContainer.push(fire)
            fire.alpha = 0
            fire.zIndex = 50
            TweenMax.to(fire, 3, { alpha: 100, delay: index * 0.1})
            TweenMax.to(fire, 20, {y: fire.y - Math.random() * 1000})
        }
    }

    backgroundScene2() {
        this.createPattern(this.getAssets()[13], 1900, {x: 0, y: -1}, 1)
    }

    backgroundScene3() {
        this.createPattern(this.getAssets()[12], 1900, {x: 0, y: -1}, 1)
    }

    backgroundScene() {
        const assets = this.getAssets()
        this.createPattern(assets[0], 1900, {x: 0, y: -1}, 1)

        this.textSec = new PIXI.Text('00:00:00',{
            fontFamily : 'arial', 
            fontSize: 25,
            fill : 0xff00ff,
            align : 'left'
        });

        this.textSec.x = 10
        this.textSec.y = 10
        this.textSec.zIndex = 999999
        this.container.addChild(this.textSec)
 
        
    }

    wonder() {
        this.animatedWonder.scale.x = 0.5
        this.animatedWonder.scale.y = 0.5
        this.animatedWonder.animationSpeed = 0.1

        this.animatedWonder.play()
        this.animatedWonder.zIndex = 99

        this.container.addChild(this.animatedWonder)

        this.animatedWonder.x = canvasSize().width
        this.animatedWonder.y = canvasSize().height

        this.moveWonder()

    }

    moveWonder() {
        this.animatedWonder.play()
        this.wonderIsMoving = true
        TweenMax.to(this.animatedWonder, 3, {
            x: -100 + (Math.random()*canvasSize().width + 100),
            y: -100 + (Math.random()*canvasSize().height + 100),
            onComplete: () => {
                this.animatedWonder.stop()
                this.wonderIsMoving = false
                this.wonderTimeout = setTimeout(this.moveWonder.bind(this), 3000)
            }

        })
    }


    placeFire() {
        
    }
    
    init() {

    }

    render() {
        this.renderPattern()
        const { x: xMouse, y: yMouse } = this.pixi.renderer.plugins.interaction.mouse.global
        const mx = (canvasSize().width / 2  - xMouse) / 200
        const my = (canvasSize().height / 2  - yMouse) / 200
        this.setPatternDirection({ x: mx, y: 1}, 1)
        this.counter++
        
        const hours = Math.floor(this.counter / 60 / 60);
        const minutes = Math.floor(this.counter / 60) - (hours * 60);
        const seconds = this.counter % 60;

        if(this.textSec) this.textSec.text = `${hours}::${minutes}::${seconds}`

        if (this.wonderIsMoving === false && this.animatedWonder) {
            this.animatedWonder.y += 1
            this.animatedWonder.x += mx
        }

        if (this.lasersContainer && this.lasersContainer.length) {
            this.lineGraph.clear()
            this.lasersContainer.forEach(laser => {
                this.laserCounter += 0.1
                
                const x1 = laser.x1 + (Math.cos(this.laserCounter) * 100)
                const x2 = laser.x2 + (Math.sin(this.laserCounter) * 100)
                const y1 = laser.y1 + (Math.cos(this.laserCounter) * 100)
                const y2 = laser.y2 + (Math.sin(this.laserCounter) * 100)

                this.lineGraph.lineStyle(2, 0xf3149d)
                    .moveTo(x1, y1)
                    .lineTo(x2, y2);
            })
        }

        if (this.fireContainer) {
            this.fireContainer.forEach(fire => {
                if (fire.x) {
                    fire.x += mx/2
                }
            })
        }
        
        if(this.crt) {
            this.crt.time += 1
        }

        if(this.getAsset(10)) {
            this.getAsset(10).sprite.x += mx / 5
            this.getAsset(10).sprite.y += my / 5
        }

        if (this.getAsset(502)) {
            this.getAsset(502).sprite.x = canvasSize().width - 40
        }

        if (this.getAsset(501)) {
            this.getAsset(501).sprite.x = canvasSize().width - 40 - 30
        }

        if (this.getAsset(500)) {
            this.getAsset(500).sprite.x = canvasSize().width - 40 - 30 - 30 
        }
    }
    
    destroy() {
        this.destroyFire()
        this.container.filters = []
        this.destroyPattern()
        this.destroyBackground()
        this.container.removeChild(this.textSec)
        
        if (this.laserSprite) {
            this.container.removeChild(this.laserSprite)
            this.laserSprite = null
        }

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

