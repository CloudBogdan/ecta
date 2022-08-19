import config from "../../utils/config.js";
import { INote } from "../../utils/types.js";

class GeneratedSound {
    notes: INote[]
    volume: number
    initialVolume: number
    looped: boolean
    speed: number

    currentNote: number
    playingTime: number
    playing: boolean
    
    constructor(notes: INote[], speed: number, volume: number, looped: boolean) {
        this.notes = notes;
        this.volume = volume;
        this.initialVolume = volume;
        this.looped = looped;
        this.speed = speed;

        this.currentNote = 0;
        this.playingTime = 0;
        this.playing = false;
    }

    /**
     * @param {number} [volume=1]
     * @param {boolean} [stopBeforePlay=true]
     */
    play(volume: number=1, stopBeforePlay: boolean=true) {
        if (stopBeforePlay)
            this.stop();

        this.volume = this.initialVolume * volume;
        this.playing = true;
    }
    pause() {
        this.playing = false;
    }
    stop() {
        this.pause();
        this.currentNote = 0;
        this.playingTime = 0;
    }

    update() {
        if (this.playing) {
            this.playingTime ++;
            if (this.playingTime % this.speed == 0 && this.currentNote < this.notes.length-1) {
                const note = this.notes[this.currentNote];
                
                if (note) {
                    const oscillator = note.context.createOscillator();
                    const gain = note.context.createGain();
                    
                    oscillator.frequency.value = (config.NOTES[note.name] || 100)*note.volume;
                    oscillator.type = note.type;
                    
                    oscillator.connect(gain);
                    gain.connect(note.context.destination);
                    
                    oscillator.start(0);
                    gain.gain.exponentialRampToValueAtTime(.00001, note.context.currentTime + 1);
                }
                
                this.currentNote ++;
            }
        }
    }
}
export default GeneratedSound;