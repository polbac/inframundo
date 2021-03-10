import Track_ from './_/track'
import TrackDown from './down/track'
import TrackInframundo from './inframundo/track'
import TrackRitmo from './ritmo/track'
import TrackXilbaba from './xilbaba/track'
import TrackHigher from './higher/track'
import TrackLaLlamada from './la-llamada/track'
import TrackWorkout from './workout/track'


export default class TrackManager {
    constructor(pixi, prismic, container, shapes) {
        this.pixi = pixi
        this.container = container
        this.prismic = prismic
        this.last = null
        this.current = null
        this.currentIndex = 0
        this.shapes = shapes

        this.tracks = {
            'X7lHTBIAACEADoXz': {c: Track_, order: 0},
            'X-pNGxAAACMAg9PJ': {c: TrackInframundo, order: 1},
            'YCq0nxIAACAAY79Z': {c: TrackWorkout, order: 2},
            'YCP5CBUAACMAsdV0': {c: TrackHigher, order: 3},
            'YCqcMxIAACEAY1Oy': {c: TrackLaLlamada, order: 4},
            
            'X-MzjRAAACUAZGBh': {c: TrackDown, order: 5},
            
            'YAxz5hUAACQASaT7': {c: TrackRitmo, order: 6},
            'YA4UVBUAACUAUNOd': {c: TrackXilbaba, order: 7},
            
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
        this.show(this.tracks[index].c, index)
    }

    show(d) {

        if (this.current) {
            this.current.destroy()
                .then(() => {
                    this.current = null
                    const temporal = new this.tracks[d.id].c(
                        prismic.getTrackData(d.id),
                        this.pixi,
                        this.container,
                        this.shapes
                    )
                    this.current = temporal
                    this.current.start()
                })
            return
        }

        const temporal = new this.tracks[d.id].c(
            prismic.getTrackData(d.id),
            this.pixi,
            this.container,
            this.shapes
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
        if (this.current && this.current.resize) this.current.resize()
    }
}