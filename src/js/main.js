import * as PIXI from 'pixi.js'
import { Player } from './player';
import { canvasSize } from './utils'
import prismic from './repository/prismic'
import TrackManager from './tracks/track-manager';
import Intro from './intro';
import {TweenMax} from 'gsap'

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
    container.sortableChildren = true
    pixi.stage.addChild(container)
    
    let intro = new Intro(pixi, container)
    
    trackManager = new TrackManager(pixi, prismic, container)

    intro.sprite.on('click', () => {
      intro.destroy()
      intro = null
      trackManager.show('_')
      player.loadSong()
    });

    player = new Player(pixi.stage, prismic, trackManager, container);

    pixi.ticker.add((delta) => {
      player.render()
      if (intro) {
        intro.render()
      }
    });

    var size = [1920, 1080];
    var ratio = size[0] / size[1];
    var renderer = PIXI.autoDetectRenderer(size[0], size[1], null);

    function resize() {
      if (window.innerWidth / window.innerHeight >= ratio) {
          var w = window.innerHeight * ratio;
          var h = window.innerHeight;
      } else {
          var w = window.innerWidth;
          var h = window.innerWidth / ratio;
      }
      renderer.view.style.width = w + 'px';
      renderer.view.style.height = h + 'px';

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
