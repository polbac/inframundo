import Track_ from './_/track'


export default class TrackManager {
    constructor(pixi, prismic, container) {
        this.pixi = pixi
        this.container = container
        this.prismic = prismic
        this.last = null
        this.current = null
        this.tracks = {
            '_': Track_
        }
    }

    show(slug) {
        const temporal = new this.tracks[slug](
            prismic.getTrackData(slug),
            this.pixi,
            this.container
        )

        if (this.current) {
            this.current.destroy()
                .then(() => this.current = temporal)
            return
        }

        this.current = temporal
    }

    getColors() {
        const { color1, color2 } = this.current.getColors()

        return {
            color1,
            color2
        }
    }

    setTrackDuration(duration) {
        this.current.setDuration(duration)
    }

    setTrackCurrentTime(currentTime) {
        this.current.setCurrentTime(currentTime)
    }
}