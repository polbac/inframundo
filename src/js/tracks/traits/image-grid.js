import { getPixiSprite, canvasSize } from '../../utils'
import {TweenMax} from 'gsap'
export default {
    createImageGrid(assets, container) {
        this.isGridActive = true
        this.assetsGrid = [...assets]
        this.container = container
        this.objects = []
        
        this.interval = setInterval(this.create.bind(this), 6000)
        this.create()
    },

    create() {
        if (!this.isGridActive) return
        console.log('create')
        if (this.objects.length === this.assetsGrid.length) {
            this.objects = []
        }

        this.destroySprites()

        const assets = this.getRandomAssets()
        
        
        assets.forEach(asset => {
            const sp = getPixiSprite(this.assetsGrid[asset])

            this.resizeAndPosition(sp.sprite, this.assetsGrid[asset])
            
            this.objects.push({
                index: asset,
                sprite: sp.sprite,
                texture: sp.texture,
                end: sp.isVideo ? false : true,
            })
            
            this.container.addChild(sp.sprite)
            sp.sprite.xIndex = 19
            const rnd = Math.random()

            if (rnd > 0.75) {
                TweenMax.to(sp.sprite, 6, { x:sp.sprite.x - 100, y: sp.sprite.y - 100})
            } else if (rnd > 0.5) {
                TweenMax.to(sp.sprite, 6, { x:sp.sprite.x})
            } else if (rnd > 0.25) {
                TweenMax.to(sp.sprite, 6, { y:sp.sprite.y - 200})
            } else {
                TweenMax.to(sp.sprite, 6, { x:sp.sprite.x + 100, y:sp.sprite.y - 200})
            }
            

            if (sp.isVideo) {
                sp.object.index = asset
            }
        })
    },

    

    resizeAndPosition(sprite, media) {
        if (!this.isGridActive) return
        const { alto, ancho } = media
        const res = ancho.value / alto.value
        const screen = canvasSize()

        const width = 100 + (Math.random() * screen.width * 0.3)
        const height = width / res

        const x = Math.random() * (screen.width - width)
        const y = Math.random() * (screen.height - height)
        
        sprite.width = width
        sprite.height = height
        sprite.x = x
        sprite.y = y
    },

    getRandomAssets() {
        if (!this.isGridActive) return
        let total = Math.ceil(Math.random() * 4)

        if (total > 4){
            total = 4
        }
        
        if (total === 0) {
            return []
        }

        const assets = []
        let i = 0
        
        while (i < total) {
            const some = Math.floor(Math.random() * this.assetsGrid.length)
            const someAsset = this.objects.find(obj => obj.index === some)
            
            if (!someAsset) {
                assets.push(some)
                i++
            }
            
        }

        return assets
    },

    destroySprites() {
        
        if (!this.objects || !this.objects.length) return

        this.objects.forEach((object, index) => {
            TweenMax.killTweensOf(object.sprite)
            this.container.removeChild(object.sprite)
            object.texture.destroy(true)
        })

        this.objects = []

    },

    destroyImageGrid() {
        this.isGridActive = false
        clearInterval(this.interval)
        this.destroySprites()
    }
}