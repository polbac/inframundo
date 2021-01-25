import Track_ from './_/track'
import TrackDown from './down/track'
import TrackInframundo from './inframundo/track'
import TrackRitmo from './ritmo/track'
import TrackXilbaba from './xilbaba/track'


export default class TrackManager {
    constructor(pixi, prismic, container) {
        this.pixi = pixi
        this.container = container
        this.prismic = prismic
        this.last = null
        this.current = null
        this.currentIndex = 0
        this.tracks = {
            'X7lHTBIAACEADoXz':Track_,
            'X-MzjRAAACUAZGBh': TrackDown,
            'X-pNGxAAACMAg9PJ': TrackInframundo,
            'YAxz5hUAACQASaT7': TrackRitmo,
            'YA4UVBUAACUAUNOd': TrackXilbaba,
        }
    }

    render() {
        if (this.current) {
            if (this.current.render) {
                this.current.render()
            }   
        }
    }

    next() {
    
    }

    showIndex(index) {
        this.show(this.tracks[index], index)
    }

    show(d) {

        if (this.current) {
            this.current.destroy()
                .then(() => {
                    this.current = null
                    const temporal = new this.tracks[d.id](
                        prismic.getTrackData(d.id),
                        this.pixi,
                        this.container
                    )
                    this.current = temporal
                    this.current.start()
                })
            return
        }

        const temporal = new this.tracks[d.id](
            prismic.getTrackData(d.id),
            this.pixi,
            this.container
        )

        this.current = temporal
        this.current.start()
        
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

    resize() {
        if (this.current.resize) this.current.resize()
    }
}