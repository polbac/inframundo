import * as PIXI from 'pixi.js'

export const canvasSize = () => ({
    width: window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth,
    height: window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight
})

export const resizeCover = (sprite, originalWidth, originalHeight) => {
    const { width, height } = canvasSize()

    const resSprite = originalWidth / originalHeight
    const resCanvas = width / height

    if (resSprite < resCanvas) {
        sprite.width = width
        sprite.height = width * originalHeight / originalWidth
    } else {
        sprite.height = height
        sprite.width = height * resSprite
    }

    sprite.x = width/2 - sprite.width/2
    sprite.y = height/2 - sprite.height/2
}

export function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export function mix(...mixins) {
    class Mix {}
    for (let mixin of mixins) {
        copyProperties(Mix, mixin);
        copyProperties(Mix.prototype, mixin.prototype);
    }
    return Mix;
}


function copyProperties(target, source) {
    for (let key of Reflect.ownKeys(source)) {  
        if (key !== "constructor" &&  key !== "prototype" && key !== "name") {
            let desc = Object.getOwnPropertyDescriptor(source, key);
            Object.defineProperty(target, key, desc);
        }
    }
}

export function getPixiSprite(media) {
    const file = media.asset.value.file ? media.asset.value.file.url : media.asset.value.image.url
    const isVideo = file.search('.mp4') !== -1

    if (isVideo) {        
        const video = document.createElement("video");
        video.crossOrigin = "anonymous"; 
        video.preload = "auto";
        video.loop = true;
        video.volume = 0
        video.src = file;
        
        const texture = PIXI.Texture.from(video);    
        return new PIXI.Sprite(texture);
    }

    const texture = PIXI.Texture.from(file);

    return new PIXI.Sprite(texture);
    
}

export function getPixiSpriteString(url) {
    return getPixiSprite({
        asset: {
            value: {
                file: {
                    url
                }
            }
        }
    })
}

export function center(sprite) {
    sprite.x = canvasSize().width / 2 - sprite.width / 2
    sprite.y = canvasSize().height / 2 - sprite.height / 2
}