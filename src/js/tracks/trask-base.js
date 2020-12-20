import * as PIXI from 'pixi.js'
import {TweenMax} from 'gsap'
import { resizeCover, shuffle, center } from '../utils'

export default class TrackBase {
    constructor(data, pixi, container, name) {
        this.data =  data.data.track
        this.name =  name
        this.assets = this.data.assets.value
        this.pixi = pixi
        this.container = container
        this.currentTime = 0
        this.duration = 0
        this.currentInterval = 0
        this.randomBackgrounds = []

        this.DEFAULT_TTL_RANDOM_BACKGROUND = 5000
        
        this.setTitle()
        this.loadAssets()
            
        
        this.trackSprite = new PIXI.Container();
        this.trackSprite.sortableChildren = true;
        
        this.container.addChild(this.trackSprite)
        
        this.showName()
    }

    showName() {
        this.text = new PIXI.Text(this.name,{
            fontFamily : 'UnifrakturCook', 
            fontSize: 94,
            fill : 0xffffff,
            align : 'center'
        });
        this.trackSprite.addChild(this.text)
        this.text.zIndex = 999
        center(this.text)

        TweenMax.from(this.text, 2, { alpha: 0, y: this.text.y })
        TweenMax.to(this.text, 2, { alpha: 0, delay: 3 })
    }

    getAssets() {
        return this.assets
    }

    setAreas(areas) {
        this.areas = areas
        this.currentArea = null
    }

    setTitle() {
        document.title = `NFRMN -- ${this.name}`
    }

    setBackground() {
        this.pixi.renderer.backgroundColor = parseInt(this.data.color_de_fondo.value.slice(1), 16)
    }

    setRandomBackgrounds(randomBackgrounds) {
        this.randomBackgrounds = shuffle(randomBackgrounds)
        this.createRandomBackgrounds()
    }

    createRandomBackgrounds() {
        if (this.intervalRandomBackgrounds) {
            clearInterval(this.intervalRandomBackgrounds)
        }

        this.currentRandomBackgroundIndex = -1

        this.intervalRandomBackgrounds = setInterval(
            this.changeRandomBackground.bind(this), 
            this.DEFAULT_TTL_RANDOM_BACKGROUND
        )

        this.changeRandomBackground()
    }

    changeRandomBackground() {
        this.currentRandomBackgroundIndex++

        if (this.currentRandomBackgroundIndex === this.randomBackgrounds.length) {
            this.currentRandomBackgroundIndex = 0
        }

        this.setBackground(
            this.randomBackgrounds[this.currentRandomBackgroundIndex]
        )        
    }

    loadAssets() {
        return new Promise(resolve => {
            const assets = this.data.assets.value
            
            assets.forEach(({asset}) => {
                
            })
            resolve()
        })
    }

    getColors() {
        return {
            color1: this.color1,
            color2: this.color2,
        }
    }

    setCurrentTime(currentTime) {
        this.currentTime = currentTime
        this.checkInterval()
    }

    setDuration(duration) {
        this.duration = duration
        this.checkInterval()
    }

    checkInterval() {
        const minute = this.currentTime / 60

        const currentArea = this.areas.reduce((prev, current) => {
            if (minute >= current.time ) {
                return current
            }
            return prev
        }, null)

        if (currentArea) {
            if (this.currentArea) {
                if (currentArea.time === this.currentArea.time) {
                    return
                }
            }
            
            this.currentArea = currentArea
            currentArea.call()
        }
    }

    setBackground(media) {
        this.destroyBackground()

        const file = media.asset.value.file ? media.asset.value.file.url : media.asset.value.image.url


        if (file.search('.mp4') !== -1) {
            this.setBackgroundVideo(media)
            return
        }

        this.setBackgroundImage(media)
    }

    setBackgroundVideo(media) {
        const file = media.asset.value.file ? media.asset.value.file.url : media.asset.value.image.url
        
        const video = document.createElement("video");
        video.crossOrigin = "anonymous"; 
        video.preload = "auto";
        video.loop = true;
        video.volume = 0
        video.src = file;

        this.backgroundVideoWidth = media.ancho.value
        this.backgroundVideoHeight =  media.alto.value
        this.backgroundVideoTexture = PIXI.Texture.from(video);
        
        
        this.backgroundVideoSprite = new PIXI.Sprite(this.backgroundVideoTexture);
        
        this.trackSprite.addChild(this.backgroundVideoSprite)
        this.resize()
    }

    setBackgroundImage(media) {
        const file = media.asset.value.file ? media.asset.value.file.url : media.asset.value.image.url

        this.backgroundImageWidth = media.ancho.value
        this.backgroundImageHeight =  media.alto.value
        this.backgroundImageTexture = PIXI.Texture.from(file);
        this.backgroundSprite = new PIXI.Sprite(this.backgroundImageTexture);
        
        this.trackSprite.addChild(this.backgroundSprite)
        this.resize()
    }

    destroyBackground() {
        if (this.backgroundVideoSprite) {
            this.trackSprite.removeChild(this.backgroundVideoSprite)
            this.backgroundVideoSprite = null
        }

        if (this.backgroundVideoTexture) {
            this.backgroundVideoTexture.destroy(true)
            this.backgroundVideoTexture = null
        }

        if (this.backgroundSprite) {
            this.trackSprite.removeChild(this.backgroundSprite)
        }
    }

    resize() {
        if (this.backgroundVideoSprite) {
            resizeCover(this.backgroundVideoSprite, this.backgroundVideoWidth, this.backgroundVideoHeight)
        }

        if (this.backgroundSprite) {
            resizeCover(this.backgroundSprite, this.backgroundImageWidth, this.backgroundImageHeight)
        }
        
    }
}