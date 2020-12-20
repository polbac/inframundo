import Prismic from 'prismic-javascript'

class PrismicManager {
    constructor() {
        this.data = []
    }
    
    config() {
        return new Promise((resolve, reject) => {
            Prismic.api("https://inframundo.prismic.io/api").then((api) => {
                return api.query("");
            }).then((response) => {
                console.log("Track assets loaded: ", response.results);
                this.data = response
                resolve()
            }, function(err) {
                reject()
            });
        }) 
    }

    getTrackData(slug) {
        return this.data.results.find(track => track.slugs[0] === slug)
    }

}

if (!global.prismic) {
    global.prismic = new PrismicManager()
}

export default global.prismic