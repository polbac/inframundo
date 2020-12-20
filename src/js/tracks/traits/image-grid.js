import { getPixiSprite, canvasSize } from '../../utils'

export default {
    createImageGrid(assets, container) {
        this.assets = assets
        this.container = container
        this.used = []
        this.sprites = []

        setInterval(this.create.bind(this), 6000)
        this.create()
    },

    create() {
        if (this.used.length === this.assets.length) {
            this.used = []
        }
        
        this.destroySprites()

        const assets = this.getRandomAssets()
        this.used = this.used.concat(assets)
        
        this.showAssets(assets)
    },

    showAssets(assets) {
        assets.forEach(asset => {
            const sprite = getPixiSprite(this.assets[asset])
            this.resizeAndPosition(sprite, this.assets[asset])
            this.sprites.push(sprite)
            this.container.addChild(sprite)
            sprite.xIndex = 19
        })
    },

    resizeAndPosition(sprite, media) {
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
        const total = Math.ceil(Math.random() * (this.assets.length - this.used.length))
        
        if (total === 0) {
            return []
        }

        const assets = []
        let i = 0

        while (i < total) {
            const some = Math.floor(Math.random() * this.assets.length)
            if (this.used.indexOf(some) === -1) {
                assets.push(some)
                i++
            }
            
        }

        return assets
    },

    destroySprites() {
        this.sprites.forEach(sprite => {
            this.container.removeChild(sprite)
        })

        this.sprites = []
    },

    destroyImageGrid() {
        
    }
}