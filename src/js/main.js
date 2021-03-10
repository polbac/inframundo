import * as PIXI from 'pixi.js'
import { GlitchFilter } from 'pixi-filters'
import { Player } from './player';
import { canvasSize } from './utils'
import prismic from './repository/prismic'
import TrackManager from './tracks/track-manager';
import Intro from './intro';
import {TweenMax} from 'gsap'
import Credits from './credits'
import Shapes from './shapes'
import Noise from './noise'

window.noise = Noise

let player
let trackManager
let pixi

let isClicking = false
let clickInterval = null

let filter = new GlitchFilter()

prismic.config()
  .then(res => {
    pixi = new PIXI.Application({
      backgroundColor: 0x000000,
      width: canvasSize().width,
      height: canvasSize().height,
      view: document.querySelector('#scene'),
      resolution: window.devicePixelRatio || 1,
      antialias: true,
    });
    Noise.play()
    const container = new PIXI.Container()
    const shapesContainer = new PIXI.Container()
    const shapes = new Shapes(shapesContainer, res)
    container.sortableChildren = true
    pixi.stage.addChild(container)
    pixi.stage.addChild(shapesContainer)
    pixi.renderer.autoResize = true;
    
    let intro = new Intro(pixi, container)
    
    trackManager = new TrackManager(pixi, prismic, container, shapes)
    TweenMax.set(intro.sprite,  { alpha: 0})
    document.fonts.ready.then(function () {
      TweenMax.to(intro.sprite, 3, { alpha: 1})
    });

    intro.enterSprite.on('click', () => {
      Noise.stop()
      const body = document.querySelector('body')

      TweenMax.to(intro.filter, 1, { boundary:0.06})
            
      if (body.requestFullscreen) {
        body.requestFullscreen();
        
      } else if (body.webkitRequestFullscreen) { /* Safari */
        body.webkitRequestFullscreen();
      } else if (body.msRequestFullscreen) { /* IE11 */
        body.msRequestFullscreen();
      }
      
      document.querySelector('.legend').classList.add('none')
      

      TweenMax.to(intro.sprite, 3, { alpha:0, onComplete: () => {
        intro.destroy()
        intro = null

        player.loadSong()
        container.interactive = true
        
        document.querySelector('#next-song').addEventListener('click', () => {
            player.next()
        })

        clickInterval = setInterval(() => {
          if (!isClicking) {
            window.effect()    
          }
          isClicking = false
        }, 4000)

        window.effect = () => {
          if(Math.random() > 0.66) {
            pixi.stage.filters = []
            return
          }

          pixi.stage.filters = [filter]
          filter.slices = Math.floor(Math.random() * 100)
          filter.offset = Math.floor(Math.random() * 100)
          /* filter.direction = Math.floor(Math.random() * 100) */

          filter.red = [
            -50 + Math.floor(Math.random() * 100),
            -50 + Math.floor(Math.random() * 100),
          ]

          filter.blue = [
            -50 + Math.floor(Math.random() * 100),
            -50 + Math.floor(Math.random() * 100),
          ]

          filter.green = [
            -50 + Math.floor(Math.random() * 100),
            -50 + Math.floor(Math.random() * 100),
          ]
        }

        container.on('click', () => {
          window.effect()
          isClicking = true
        })

        document.querySelector('#next-song').style.display = 'block'
    }})
    });

    player = new Player(pixi.stage, prismic, trackManager, container);
    
    new Credits(pixi.stage, container);

    pixi.ticker.add(() => {
      player.render()
      shapes.render()

      if (intro) {
        intro.render()
      }

      if (trackManager) {
        trackManager.render()
      }
    });

    var size = [1920, 1080];
    var ratio = size[0] / size[1];
    var renderer = PIXI.autoDetectRenderer(size[0], size[1], null);

    function resize() {
      pixi.renderer.resize(window.innerWidth,window.innerHeight )
      
      if (trackManager) {
        trackManager.resize()
      }

      if (intro) {
        intro.resize()
      }
  }

  window.onresize = resize;
})


const $bigBall = document.querySelector('.cursor__ball--big');
const $smallBall = document.querySelector('.cursor__ball--small');
const $hoverables = document.querySelectorAll('.hoverable');

// Listeners
//document.body.addEventListener('mousemove', onMouseMove);


// Move the cursor
/* function onMouseMove(e) {
  TweenMax.to($bigBall, .4, {
    x: e.pageX - 15,
    y: e.pageY - 15
  })
  TweenMax.to($smallBall, .1, {
    x: e.pageX - 5,
    y: e.pageY - 7
  })
} */
