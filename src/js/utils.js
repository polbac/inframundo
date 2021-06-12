import * as PIXI from 'pixi.js-legacy'

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
    let file = media.asset.value.file && media.asset.value.file.url

    if (!file) {
        file = media.asset.value.image && media.asset.value.image.url
    }

    if (!file) {
        file = media.asset.value.main && media.asset.value.main.url
    }
        
    const width = media.ancho.value
    const height = media.alto.value
    const res = width / height
    const isVideo = file.search('.mp4') !== -1

    if (isVideo) {        
        const video = document.createElement("video");
        video.crossOrigin = "anonymous"; 
        video.preload = "auto";
        video.loop = true;
        video.volume = 0
        video.src = file;
        
        const texture = PIXI.Texture.from(video);    

        return {
            sprite: new PIXI.Sprite(texture),
            object: video,
            texture,
            isVideo: true,
            media,
            width,
            height,
            res
        };
    }

    const texture = PIXI.Texture.from(file);

    return {
        sprite: new PIXI.Sprite(texture),
        texture,
        object: null,
        isVideo: false,
        media,
        width,
        height,
        res
    };
    
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

let timerId

export const  throttle  =  function (func, delay) {
	// If setTimeout is already scheduled, no need to do anything
	if (timerId) {
		return
	}

	// Schedule a setTimeout after delay seconds
	timerId  =  setTimeout(function () {
		func()
		
		// Once setTimeout function execution is finished, timerId = undefined so that in <br>
		// the next scroll event function execution can be scheduled by the setTimeout
		timerId  =  undefined;
	}, delay)
}