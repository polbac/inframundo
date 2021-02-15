import * as PIXI from 'pixi.js'
import {TweenMax} from 'gsap'
import { resizeCover, shuffle, center, getPixiSprite, canvasSize } from '../utils'

export default class TrackBase {
    constructor(data, pixi, container, name) {
        this.data =  data.data.track
        this.name =  name
        this.assets = this.data.assets.value
        this.pixi = pixi
        this.container = container
        this.container.sortableChildren = true
        this.currentTime = 0
        this.duration = 0
        this.currentInterval = 0
        this.randomBackgrounds = []
        this.mounted = true
        this.asserLayers = []
        this.patternSprite = []
        this.patternDirection_ = []

        this.DEFAULT_TTL_RANDOM_BACKGROUND = 10000
        
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
        document.title = `INFRAMUNDO -- ${this.name}`
    }

    setBackground() {
        this.pixi.renderer.backgroundColor = parseInt(this.data.color_de_fondo.value.slice(1), 16)
    }

    setRandomBackgrounds(randomBackgrounds, interval) {
        this.interval = interval || this.DEFAULT_TTL_RANDOM_BACKGROUND
        this.randomBackgrounds = shuffle([...randomBackgrounds])
        this.createRandomBackgrounds()
    }

    backgroundIn() {
        TweenMax.from(this.backgroundVideoSprite, 30, { alpha: 0 })
    }

    createRandomBackgrounds() {
        if (this.intervalRandomBackgrounds) {
            clearInterval(this.intervalRandomBackgrounds)
        }

        this.currentRandomBackgroundIndex = -1

        this.changeRandomBackground()
    }

    destroyAreas() {
        this.mounted = false
        document.querySelectorAll('video').forEach(video => {
            video.src = null
        })

        clearInterval(this.intervalRandomBackgrounds)
    }

    changeRandomBackground() {
        
        if (!this.mounted) return
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
        /* console.log(minute) */
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
        
        const video = videoCache(file)
        

        this.backgroundVideoWidth = media.ancho.value
        this.backgroundVideoHeight =  media.alto.value
        this.backgroundVideoTexture = PIXI.Texture.from(video);
        
        if (this.randomBackgrounds.length > 1) {
            const duration = this.backgroundVideoTexture.baseTexture.resource.source.duration *1000 || this.interval

            this.intervalRandomBackgrounds = setTimeout(() => {
                this.changeRandomBackground()
            }, duration)
        }

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
        
        if (this.randomBackgrounds.length > 1) {   
            this.intervalRandomBackgrounds = setTimeout(this.changeRandomBackground.bind(this), this.interval)
        }
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
        const canvas = canvasSize()

        if (this.backgroundVideoSprite) {
            resizeCover(this.backgroundVideoSprite, this.backgroundVideoWidth, this.backgroundVideoHeight)
        }

        if (this.backgroundSprite) {
            resizeCover(this.backgroundSprite, this.backgroundImageWidth, this.backgroundImageHeight)
        }

        if (this.patternSprite) {
            for (let index = 0; index < this.patternSprite.length; index++) {
                const element = this.patternSprite[index];
                if (element) {
                   resizeCover(element, canvas.width, canvas.height)
                }
            }
        }

        
    }

    addAsset(index, asset) {
        if (this.asserLayers[index]) {
            this.trackSprite.removeChild(this.asserLayers[index])
            this.asserLayers[index] = null
        }

        this.asserLayers[index] = getPixiSprite(asset)
        this.trackSprite.addChild(this.asserLayers[index].sprite)
        this.asserLayers[index].sprite.zIndex = index

        this.resize()
    }

    getAsset(index) {
        return this.asserLayers[index]
    }

    removeAsset(index) {
        const element = this.asserLayers[index];
        
        if(element) {
            this.trackSprite.removeChild(element.sprite)   
            this.asserLayers[index] = null
        }
    }

    removeAssets() {
        for (let index = 0; index < this.asserLayers.length; index++) {
            const element = this.asserLayers[index];
            if(element) this.trackSprite.removeChild(element.sprite)   
        }
        this.asserLayers = []
    }

    setPatternDirection(direction, index) {
        this.patternDirection_[index] = direction
    }

    renderPattern() {
        if (this.patternSprite) {
            for (let index = 0; index < this.patternSprite.length; index++) {
                const element = this.patternSprite[index];
                const direction = this.patternDirection_[index];

                if (element) {
                    element.tilePosition.x += direction.x
                    element.tilePosition.y += direction.y
                }
                
            }
            
        }
    }

    createPattern(media, widthFrame, direction, zIndex) {
        this.patternDirection_[zIndex] = direction

        const file = media.asset.value.file ? media.asset.value.file.url : media.asset.value.image.url
        
        const img = new Image()
        img.crossOrigin = 'anonymous'

        img.onload = () => {
            const width = media.ancho.value
            const height =  media.alto.value

            img.width = widthFrame
            img.height = img.width * height/width
            let patternTexture = PIXI.Texture.from(img)
            patternTexture = new PIXI.Texture(patternTexture)
            patternTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
            let texRectangle = new PIXI.Rectangle(0, 0, img.width, img.height);
            patternTexture.frame = texRectangle;
            
            this.patternSprite[zIndex] = new PIXI.TilingSprite(
                patternTexture,
            );
            
            /* this.patternSprite.uvMatrix.clampOffset = 10
            this.patternSprite.uvMatrix.clampMargin = 10 */
            this.container.addChild(this.patternSprite[zIndex])
            this.patternSprite[zIndex].sortableChildren = true
            this.patternSprite[zIndex].zIndex = zIndex

            this.resize()

        }
        img.src = file
        
    }

    destroyPattern() {
        if (this.patternSprite) {
            for (let index = 0; index < this.patternSprite.length; index++) {
                const element = this.patternSprite[index];
                if (element) {
                    this.container.removeChild(element)
                }
                
            }
        }
        this.patternSprite = []
    }
}

const VIDEO_CACHE = {}

const videoCache = (file) => {
    /* if (VIDEO_CACHE[file]) {
        return VIDEO_CACHE[file]
    } */

    const video = document.createElement("video");
    video.crossOrigin = "anonymous"; 
    video.preload = "auto";
    video.loop = true;
    video.volume = 0
    video.src = file;

    //VIDEO_CACHE[file] = video

    return video
}