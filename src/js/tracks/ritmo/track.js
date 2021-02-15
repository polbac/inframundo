import { GlowFilter } from 'pixi-filters'
import TrackBase from '../trask-base'
import { canvasSize, getPixiSprite } from '../../utils'
import {TweenMax} from 'gsap'
import * as PIXI from 'pixi.js'

const LAYOUT_START = 'layoutStart'



export default class Ritmo extends TrackBase{
    constructor(data, pixi, container, shape) {
        super(data, pixi, container, 'ritmo', shape)

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
        TweenMax.set(this.container, { alpha: 0 })
        TweenMax.to(this.container, 1, { alpha: 1 })

        this.setAreas([
            { time: 0, call: this.init.bind(this) },
            { time: 0.04, call: this.card.bind(this, 1, 1) },
            { time: 0.1, call: this.card.bind(this, 2, 2) },
            { time: 0.2, call: this.card.bind(this, 1, 3) },
            { time: 0.3, call: this.card.bind(this, 2, 4) },
            { time: 0.4, call: this.card.bind(this, 1, 5) },
            { time: 0.5, call: this.card.bind(this, 2, 6) },
            { time: 0.5, call: this.card.bind(this, 1, 7) },
            { time: 0.7, call: this.card.bind(this, 1, 8) },
            { time: 0.76, call: this.rythm.bind(this) },
            { time: 1.25, call: this.lyon.bind(this) },
            { time: 1.40, call: this.doubleFight.bind(this) },
            { time: 1.66, call: this.doubleFightFollow.bind(this) },
            { time: 2.2, call: this.video1.bind(this) },
            { time: 2.94, call: this.fightAgain.bind(this) },
            { time: 3.27, call: this.video2.bind(this) },
            { time: 4.45, call: this.videoEnd.bind(this) },
        ])
    }


    init() {
        const assets = this.getAssets()
        
        this.backgroundIn()
       
    }

    card(card, index) {
        const assets = this.getAssets()
        this.addAsset(index, card === 1 ? assets[3] : assets[2])  
        this.getAsset(index).sprite.x = Math.random() * 1000
        this.getAsset(index).sprite.y = Math.random() * 1000
        this.getAsset(index).sprite.pivot.set(150,150)
        this.resizeTrack()
    }

    

    rythm() {
        this.removeAssets()
        const canvas = canvasSize()
        const assets = this.getAssets()
        
        this.setRandomBackgrounds([
            assets[0],
        ])

        this.backgroundIn()
        

        this.chooseYourFighter =  new PIXI.Text(`choose your figther`,{
            fontFamily : 'UnifrakturCook', 
            fontSize: 75,
            fill : 0xefff00,
            align : 'center',
            fontWeight: 190,
        });

        this.chooseYourFighter.x = canvas.width / 2 - this.chooseYourFighter.width / 2
        this.chooseYourFighter.y = 90

        this.container.addChild(this.chooseYourFighter)

        TweenMax.from(this.chooseYourFighter, 2, { y: this.chooseYourFighter.y + 300, alpha: 0, onComplete: this.addInteractivity.bind(this) })

        this.players = [
            assets[4],
            assets[5],
            assets[9],
        ]

        this.spritePlayers = []

        this.players.forEach((pl, index) => {
            this.addAsset(10 + index, pl)
            const sp = this.getAsset(10 + index)
            sp.sprite.filters = [new GlowFilter({
                color: 0xefff00,
                innerStrength: 0,
                outerStrength: 2.2,
            })]
            sp.index = index
            this.spritePlayers.push(sp)
            this.resizeTrack()
            sp.sprite.x = ((canvas.width / 3) * index)  + ((canvas.width / 3) / 2) - sp.sprite.width / 2
            sp.sprite.y = canvas.height / 2 - sp.sprite.height / 2
            TweenMax.from(sp.sprite, 2, { y: sp.sprite.y + 300, alpha: 0  })
        })  
    }

    lyon() {
        if (this.intervalPlayer) {
            clearInterval(this.intervalPlayer)
            this.intervalPlayer = null
        }
        this.currentPlayer = null

        const rem = (c, delay) =>{
            setTimeout(() => {               
                this.container.removeChild(c)
            }, delay)
        }

        this.clones.forEach((clone, index) => {
            rem(clone.sprite, 10*index)
        })

        const canvas = canvasSize()
        const assets = this.getAssets()
        const z = this.asserLayers.length + 1
        this.addAsset(z, assets[7])  
        const l = this.getAsset(z)
        l.sprite.height = 500
        l.sprite.width = l.width * (l.width / l.height)
        l.sprite.x = canvas.width

        TweenMax.to(l.sprite, 25, { x: -400, y: -200 + canvas.height})
    }

    doubleFight() {
        const assets = this.getAssets()
        const canvas = canvasSize()
        this.gentleman1 = assets[6]
        this.gentleman2 = assets[8]

        this.addAsset(200, this.gentleman1)
        this.addAsset(201, this.gentleman2)

        this.gentleman1 = this.getAsset(200)
        this.gentleman2 = this.getAsset(201)

        this.resizeTrack()

        this.gentleman1.sprite.y = canvas.height / 2 - this.gentleman1.sprite.height / 2
        this.gentleman2.sprite.y = canvas.height / 2 - this.gentleman2.sprite.height / 2

        this.gentleman1.sprite.x = canvas.width / 4 - this.gentleman1.sprite.width / 2
        this.gentleman2.sprite.x = (canvas.width / 4) * 3 - this.gentleman2.sprite.width / 2

        TweenMax.from(this.gentleman1.sprite, 3.5, { y: canvas.height, ease: "elastic.out(1, 0.3)" })
        TweenMax.from(this.gentleman2.sprite, 3.5, { y: canvas.height, ease: "elastic.out(1, 0.3)", delay: 0.3 })
    }

    doubleFightFollow() {
        this.follow = true
    }

    addInteractivity() {
        const t = this
        this.spritePlayers.forEach((pl, index) => {
            pl.sprite.interactive = true
            pl.sprite.index = index
            //pl.sprite.hitArea = new PIXI.Circle(150, 100, 50);
            //pl.sprite.hitArea.index = index
            pl.sprite.on('mouseover', function() {
                t.selectPlayer(this.index)
            })
        })
    }

    selectPlayer(selectedIndex) {
        this.spritePlayers.forEach((pl, index) => {
            pl.sprite.interactive = false
        })

        this.container.removeChild(this.chooseYourFighter)
        
        this.currentPlayer = this.spritePlayers[selectedIndex]

        this.spritePlayers.forEach((pl, index) => {
            if(selectedIndex !== index) {
                this.removeAsset(10 + index)
            }
        })

        this.currentIndexPlayer = this.currentPlayer.sprite.index

        this.intervalPlayer = setInterval(this.changePlayer.bind(this), 1000)
    }

    changePlayer() {
        this.currentIndexPlayer++

        if(this.currentIndexPlayer === 3) {
            this.currentIndexPlayer = 0
        }
    }

    render() {
        const assets = this.getAssets()
        const { x, y } = this.pixi.renderer.plugins.interaction.mouse.global

        for (let index = 1; index <= 8; index++) {
            if (this.getAsset(index)) {
                const sprite2 = this.getAsset(index).sprite
                sprite2.x += (x - sprite2.x - 150)/100 
                sprite2.y += (y - sprite2.y - 150)/100 
                sprite2.rotation += (x - sprite2.x) / 100000
            }
        }

        if (this.currentPlayer) {
            this.currentPlayer.sprite.x = x  - 150
            this.currentPlayer.sprite.y = y - 150


            let r = [assets[4], assets[5], assets[9]]
            r = r[this.currentIndexPlayer]
            const a = getPixiSprite(r)
            const res = a.sprite.width / a.sprite.height
            a.sprite.height = 300
            a.sprite.width = a.sprite.height * res
            a.sprite.x = this.currentPlayer.sprite.x
            a.sprite.y = this.currentPlayer.sprite.y
            a.zIndex = 3
            this.container.addChild(a.sprite)

            this.clones.push(a)
        }

        if (this.follow && this.gentleman2 && this.gentleman1) {
            this.gentleman2.sprite.x = x  - 150
            this.gentleman2.sprite.y = y  - 150

            this.gentleman1.sprite.x += (x - this.gentleman1.sprite.x - 150)/50 
            this.gentleman1.sprite.y += (y - this.gentleman1.sprite.y - 150)/50 
        }
    }

    video1() {
        this.removeAssets()
        const assets = this.getAssets()

        this.setRandomBackgrounds([
            assets[11],
        ], 500) 
    }

    fightAgain() {
        const assets = this.getAssets()
        const canvas = canvasSize()

        this.lovePlayers = [
            assets[4],
            assets[5],
            assets[6],
            assets[7],
            assets[8],
            assets[9],
        ]

        this.lovePlayers.forEach((p, index) => {
            this.addAsset(300 + index, p)
            const res = p.width / p.height
            const a = this.getAsset(300 + index)
            a.sprite.x = canvas.width * Math.random()
            a.sprite.y = canvas.height
            TweenMax.to(a.sprite, 40 + Math.random()*40, {
                y: a.sprite.y - (1000 * Math.random() + 1000 ),
                x: a.sprite.x + (-600 + Math.random()*1200),
                rotation: -2 + Math.random() * 5
            })
        })

    }

    video2() {
        const assets = this.getAssets()
        this.lovePlayers.forEach((p, index) => {
            const a = this.getAsset(300 + index)
            TweenMax.to(a.sprite, 5, {
                alpha: 0
            })
        })

        this.setRandomBackgrounds([
            assets[12],
        ], 500) 
    }

    videoEnd() {
        TweenMax.to(this.container, 5, { alpha: 0})
    }

    resizeTrack() {
        const canvas = canvasSize()

        for (let index = 1; index <= 8; index++) {
            if (this.getAsset(index)) {
                const sprite2 = this.getAsset(index).sprite
                const res = sprite2.width/sprite2.height
                sprite2.width = 300
                sprite2.height = 300 * res
                sprite2.x = canvas.width / 2 - sprite2.width / 2
                sprite2.y = canvas.height / 2 - sprite2.height / 2
            }    
        }

        if(this.getAsset(11)) {
            const bg1 = this.getAsset(11).sprite
        }

        if(this.spritePlayers) {
            this.spritePlayers.forEach(pl => {
                const res = pl.width / pl.height
                pl.sprite.height = 300
                pl.sprite.width = pl.sprite.height * res
            })
        }

        if(this.gentleman1) {
            const res1 = this.gentleman1.width / this.gentleman1.height
            
            this.gentleman1.sprite.height = 350
            this.gentleman1.sprite.width = this.gentleman1.sprite.height * res1
        }

        if(this.gentleman2) {
            const res2 = this.gentleman2.width / this.gentleman2.height
            this.gentleman2.sprite.height = 350
            this.gentleman2.sprite.width = this.gentleman2.sprite.height * res2
        }
        
    }
    

    destroy() {
        if (this.intervalPlayer) {
            clearInterval(this.intervalPlayer)
            this.intervalPlayer = null
        }

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

