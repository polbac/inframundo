import * as PIXI from 'pixi.js'
import { TweenMax } from 'gsap/all'
import { canvasSize } from './utils'



const SIZE = 700
const INSISE_SIZE = SIZE * 0.7
const TOTAL_SONGS = 5

const path = [
    0,0, 
    SIZE/2,SIZE, 
    SIZE,0,
    0, INSISE_SIZE, 
    SIZE, INSISE_SIZE, 
    0,0
]

const BUTTON_SIZE = 50

const triangule = [
    0, 0,
    BUTTON_SIZE, BUTTON_SIZE/2,
    0, BUTTON_SIZE
]


export class Player{
    constructor(stage, prismic, trackManager, container, pixi) {
        this.trackManager = trackManager
        this.trackNumber = 0
        this.pixi = pixi
        this.color1 = null
        this.color2 = null
        this.isFirst = true
        this.loading = true
        this.audio = new Audio()
        this.audio.onended = this.endAudio.bind(this)
        //this.audio.volume = 0
        this.song = 0
        this.playing = false
        this.percent = 0
        this.stage = stage
        this.data = []

        

        window.onfocus = () => {
            if (!this.playing && !this.loading) {
                this.pixi.start()
                this.audio.play()
                this.playing = true
            }
            
        };
        window.onblur =  () => {
            if (this.playing) {
                this.pixi.stop()
                this.audio.pause()
                this.playing = false
            }
        };

        const orderTracks = Object.keys(trackManager.tracks).sort(function (a, b) {
            if (a.order > b.order) {
              return 1;
            }
            if (a.order < b.order) {
              return -1;
            }
            // a must be equal to b
            return 0;
          })

          
         orderTracks.forEach(_track => {
            this.data.push(prismic.data.results.find(t => _track === t.id))
        })
        this.playerSprite = new PIXI.Sprite();
        this.graphicsBackground = new PIXI.Graphics();
        this.graphics = new PIXI.Graphics();
        this.button = new PIXI.Graphics();
        this.buttonSprite = new PIXI.Sprite();
        
        
        this.playerSprite.addChild(this.graphics);
        this.playerSprite.addChild(this.graphicsBackground);
        this.playerSprite.addChild(this.buttonSprite);

        this.playerSprite.zIndex = 99999999

        container.addChild(this.playerSprite)

        this.graphicsBackground.lineStyle(1, 0x333333, 1);
        
        
        this.buttonSprite.addChild(this.button)

        this.buttonSprite.interactive = true

        this.graphics.alpha = 0


        this.buttonSprite.tap = this.buttonSprite.click = this.tooglePlay.bind(this)

        //this.draw()
        
        //document.querySelector('#comenzar').onclick = this.loadSong.bind(this);
    }
    
    endAudio() {
        this.next()
    }

    setTrack(trackNumber) {
        this.trackNumber = trackNumber
        const { color1, color2 } = this.trackManager.getColors()
        this.setColors(color1, color2)
    }

    setColors(color1, color2) {
        this.color1 = color1
        this.color2 = color2
    }

    loadSong() {
        this.loading = true
        this.audio.src = this.data[this.song].data.track.track.value.file.url
        //this.audio.addEventListener('canplaythrough', () => {
            this.loading = false
            this.audio.play()
            this.playing = true
            /* this.audio.currentTime = 165 */
            this.trackManager.show(this.data[this.song])
        //}, false)

        

        return false
    }

    tooglePlay() {
        if (this.playing) {
            this.playing = false
            this.audio.pause()  
        } else {
            this.playing = true
            this.audio.play()
        }

        
        this.draw()
        this.percent = 0   
    }

    draw() {
        /* this.graphicsBackground.drawPolygon(path);

        this.graphics.x = canvasSize().width / 2 
        this.graphics.y = canvasSize().height / 2
        
        this.buttonSprite.x = canvasSize().width / 2 - BUTTON_SIZE / 2
        this.buttonSprite.y = canvasSize().height / 2 - BUTTON_SIZE / 2

        this.button.clear()

        if (this.playing) {
            this.button.beginFill(0xfff00, 1)
            this.button.drawPolygon(triangule)
            this.button.endFill()
        } else {
            this.button.beginFill(0xfff00, 1)
            this.button.drawRect(0, 0, BUTTON_SIZE * .4, BUTTON_SIZE)
            this.button.drawRect(BUTTON_SIZE *.5, 0, BUTTON_SIZE * .4, BUTTON_SIZE)
            this.button.endFill()
        } */
        
    }

    getAudioPlayingPercent() {
        return this.audio.currentTime * this.getAudioDuration() / 100
    }

    getAudioDuration() {
        return this.audio.duration
    }

    render() {
        if (this.getAudioDuration()) {
            /* const { width, height } = canvasSize()
            const square = 10
            
            this.graphicsBackground.clear()

            this.graphicsBackground.beginFill(0x000);
            this.graphicsBackground.drawRect(0, height - square, width, square);
            this.graphicsBackground.endFill()

            this.graphicsBackground.beginFill(0xff0000);
            this.graphicsBackground.drawRect(0, height - square, (width * this.getAudioPlayingPercent()) / 100, square);
            this.graphicsBackground.endFill() */
            this.trackManager.setTrackCurrentTime(this.audio.currentTime)
        }
    }

    next() {
        this.song++

        if (this.song === this.data.length) {
            this.song = 0
        }
        
        this.loadSong()
    }
}