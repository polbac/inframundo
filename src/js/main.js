import * as PIXI from 'pixi.js'
import {GlowFilter} from '@pixi/filter-glow';
import { Player } from './player';
import { canvasSize } from './utils'

const app = new PIXI.Application({
  backgroundColor: 0x000000,
  width: canvasSize().width,
  height: canvasSize().height,
  view: document.querySelector('#scene'),
  resolution: window.devicePixelRatio || 1,
  antialias: true,
});

const sprite = new PIXI.Sprite();
const pathLines = new PIXI.Graphics();

pathLines.lineStyle(5, 0xFFFFFF, 1);
pathLines.moveTo(0, 0);
pathLines.lineTo(0, -100);
pathLines.lineTo(150, 150);
pathLines.lineTo(240, 100);

pathLines.position.x = 320;
pathLines.position.y = 150;

sprite.addChild(pathLines);

app.stage.addChild(sprite);

const player = new Player(app.stage);

sprite.filters = [
  new GlowFilter({ distance: 1, outerStrength: 1, color:0xff0000 })
];

app.ticker.add((delta) => {
  player.render()
  pathLines.y++
});