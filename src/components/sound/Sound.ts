class Sound {
    element: HTMLAudioElement
    volume: number
    
    constructor(src: string, looped: boolean=false, volume: number=1) {
        this.element = new Audio(src);
        this.element.loop = looped;
        this.element.volume = volume;

        this.volume = volume;
    }

    /**
     * @param {number} [volume=1]
     * @param {boolean} [stopBeforePlay=true]
     */
    play(volume: number=1, stopBeforePlay: boolean=true) {
        if (stopBeforePlay)
            this.stop();
            
        this.element.volume = this.volume * volume;
        this.element.play();
    }
    pause() {
        if (!this.element.paused && this.element.currentTime > 0)
            this.element.pause();
    }
    stop() {
        this.pause();
        this.element.currentTime = 0;
    }
}
export default Sound;