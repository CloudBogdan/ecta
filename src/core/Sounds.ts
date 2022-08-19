import GeneratedSound from "../components/sound/GeneratedSound.js";
import Sound from "../components/sound/Sound.js";
import { INote } from "../utils/types.js";

type IShortNote = [
    name: INote["name"],
    volume: INote["volume"],
    type: INote["type"],
];

class Sounds {
    sounds: {
        [key: string | number]: Sound | GeneratedSound
    }
    
    constructor() {
        this.sounds = {};
    }

    /**
     * @param {(string | number)} name
     * @param {number} [volume=1]
     * @param {boolean} [stopBeforePlay=true]
     * @returns {boolean}
     */
    play(name: string | number, volume: number=1, playBackRate: number=1, stopBeforePlay: boolean=true): boolean {
        const sound = this.sounds[name];
        if (!sound) {
            console.error(`Cannot find sound with name "${ name }"`);
            return false;
        }

        if (stopBeforePlay)
            this.stop(name);

        if (sound instanceof Sound) {
            sound.element.playbackRate = playBackRate;
        }
        
        sound.play(volume, stopBeforePlay);

        return true;
    }
    /**
     * @param {(string | number)} name
     * @returns {boolean}
     */
    pause(name: string | number): boolean {
        const sound = this.sounds[name];
        if (!sound) {
            console.error(`Cannot find sound with name "${ name }"`);
            return false;
        }
        
        sound.pause();

        return true;
    }
    /**
     * @param {(string | number)} name
     * @returns {boolean}
     */
    stop(name: string | number): boolean {
        const sound = this.sounds[name];
        if (!sound) {
            console.error(`Cannot find sound with name "${ name }"`);
            return false;
        }

        sound.stop();

        return true;
    }
    
    /**
     * ***This is experimental function!***
     * 
     * **I don't recommend using it!**
     *
     * @param {(string | number)} name
     * @param {[ name: string, volume: number, type: OscillatorType ][]} notes
     * @param {number} [speed=10]
     * @param {number} [volume=1]
     * @param {boolean} [looped=false]
     */
    create(name: string | number, notes: IShortNote[], speed: number=10, volume: number=1, looped: boolean=false) {
        if (this.sounds[name])
            console.warn(`Sound with name is already exits "${ name }". Override`);
        
        this.sounds[name] = new GeneratedSound(
            notes.map(n=> {
                const context = new AudioContext();

                const volume = n[1] || 1;
                const type = n[2] || "sine";
                
                return {
                    name: n[0],
                    volume,
                    type,

                    context,
                }
            }),
            speed, volume, looped
        )
    }
    /**
     * @param {(string | number)} name
     * @param {string} src
     * @param {number} [volume=1]
     * @param {boolean} [looped=false]
     */
    load(name: string | number, src: string, volume: number=1, looped: boolean=false) {
        if (this.sounds[name])
            console.warn(`Sound with name is already exits "${ name }". Override`);
            
        this.sounds[name] = new Sound(src, looped, volume);
    }

    update() {
        for (const soundsKey of Object.keys(this.sounds)) {
            const sound = this.sounds[soundsKey];
            if (sound instanceof GeneratedSound)
                sound.update();
        }
    }
}
export default Sounds;