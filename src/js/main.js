import * as PIXI from 'pixi.js'
import { Player } from './player';
import { canvasSize } from './utils'
import prismic from './repository/prismic'
import TrackManager from './tracks/track-manager';
import Intro from './intro';
import {TweenMax} from 'gsap'
import Credits from './credits'
import Shapes from './shapes'

let player
let trackManager
let pixi


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
    
    const container = new PIXI.Container()
    const shapesContainer = new PIXI.Container()
    const shapes = new Shapes(shapesContainer, res)
    container.sortableChildren = true
    pixi.stage.addChild(container)
    pixi.stage.addChild(shapesContainer)
    pixi.renderer.autoResize = true;
    
    let intro = new Intro(pixi, container)
    
    trackManager = new TrackManager(pixi, prismic, container, shapes)

    intro.enterSprite.on('click', () => {
      TweenMax.to(intro.sprite, 1, {y: -15, alpha:0, onComplete: () => {
        intro.destroy()
        intro = null

        player.loadSong()
        container.interactive = true
        container.on('click', () => {
            player.next()
        })
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
document.body.addEventListener('mousemove', onMouseMove);


// Move the cursor
function onMouseMove(e) {
  TweenMax.to($bigBall, .4, {
    x: e.pageX - 15,
    y: e.pageY - 15
  })
  TweenMax.to($smallBall, .1, {
    x: e.pageX - 5,
    y: e.pageY - 7
  })
}
