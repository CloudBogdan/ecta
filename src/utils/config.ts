import { IEctaFontPattern, IEctaSpritePattern } from "../core/Art";

const config = Object.freeze({
    VERSION: "1.0-alpha",
    VERSION_NAME: "Alpha",
    
    CANVAS_SIZE: 128,
    SPRITE_SIZE: 8,
    FONT_SHEET_WIDTH: 78,
    FONT_SHEET_HEIGHT: 48,
    CHAR_WIDTH: 5,
    CHAR_HEIGHT: 6,

    DEFAULT_PALETTE: {
        "white": "#fff",
        "black": "#000",
        "dark-purple": "#430067",
        "purple": "#94216a",
        "red": "#ff004d",
        "orange": "#ff8426",
        "yellow": "#ffdd34",
        "green": "#50e112",
        "gray-green": "#3fa66f",
        "gray-blue": "#365987",
        "blue": "#0033ff",
        "light-blue": "#29adff",
        "teal": "#00ffcc",
        "light-gray": "#fff1e8",
        "gray": "#c2c3c7",
        "brown": "#ab5236",
        "gray-brown": "#5f574f",
    },

    DEFAULT_SPRITE_SHEET: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAICAYAAACLUr1bAAAAsUlEQVQ4jWNgGOSAkRhFzgzp/xkYGBj2MsxkxMeHiaHLo6tBl8MHmIhRFKjIzLCH4RmD5tr//zXX/v+/h+EZQ6AiM4o8sppna2egyCOrCVRkZni2dgZWe/7fNfn//64JikdYiHEgDFwPOku8mhLKzIEBokIw+/5jgmKE+ITEGRgYGBiWf4JgJEBSCE5RmkeUGryOYGBg+M/YiDXxM9bcwhAmKqEyMBBO5MRkAmyZZ8gDAHiOT6Vr90TIAAAAAElFTkSuQmCC",
    DEFAULT_SPRITE_SHEET_PATTERN: {
        "empty": 0
    } as IEctaSpritePattern,
    
    DEFAULT_FONT: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE4AAAAwCAYAAAC/gkysAAAC20lEQVRoge1a0XLDIAyD3P7/l7OXuUeZJSzjNt0ueulqHKEYY4d0rd1IobPB8zzP1lrrvXfPPo+t7FU8nr333u1z5Y80MZ75+qMtYESeHfl7Y4wH+St2pAVpjXIgLAPn3azZdydf8VfwZPRE7iuUccheIZbxo2uUHRC9fuSJ3NcycOrk5w92/dV5ma+ih3FVZfUNliXMPo9daR8/32E/PIcRma5aZZ/HWJd8N9I1DiFTO7xAvLqmsCRBesbvx3hRhSDlOcv8Z1EqRxUsaBE95V1VFYV8KzKXZZCNK/yKnhsAvbVrz5gq/5i1Nhbxj9iRJs92mEE9IaBrlC6Z4Ve4VbBtbeP29zEaI90kYq+6idnmZdtKD+Pf0XmsSDKZWFFI0SJ625PpZPyKzpn/axSlCFAzMcsT0YM4qhbxRjVsVebVOQe82870KPqz9tlnnnvrfZxq9x5Q2TUIn7D9nrpqBeEVPKsTAvLPq/uAs6rCgTLUgrbTJVWkf3NQgeqTMm9GixpUNu/dpavAOpv3HUU90/UyXRjNq/Ds6nmcVb1AqLDaxNJ5HlO6c+YcnDlRRLi+xsFxL3vfme9sR/6zmIqaoSxU1I7uy+xPzQE9Z3moeL6zwo3mULDqxFHfqP5fGTc6qCvJMlTFqlauMgJxqHNmuW4AhN4AR+3/BSij4b0qbduzIxsTiB4xVChNQNW/1KcQRZ93mP1KZAIdJmMrk55k8s0EtGJehScVuKsySFmsjF31/aTd8vfBViuzkmjLIz8l05m/qjOqx7M9zqrqBOgaGxttyHf1KMOOep5vRa2Ukck6VYhSeNWMU/hLazSbtKLAZoKmbuFdjTLUG1D5VsFUMoWNKYtz42qotaBidRm3WvuUDM2UoBlPv3LNROob1ExnU970onHWfSuC5IG+yHzFhDs4T/7PQVGtxrHzZif0S/6nvDpiwZmDirJytyOHkSFWHiNeWeOQfla7o/gG2n+BLNAKVVgAAAAASUVORK5CYII=",
    DEFAULT_FONT_MAPPING: " abcdefghijklmnopqrstuvwxyzабвгдежзиклмнопрстуфхцчшщъыьэюя0123456789+-=.,;:*/()&^<>%$#@!~\"'`?|\\_[]{}",
    DEFAULT_FONT_PATTERN: {
        " ": { width: 4 },
        ".": { width: 3, offsetX: -1 },
        ",": { width: 4, offsetX: -1, offsetY: 1 },
        ";": { width: 3, offsetX: -1 },
        ":": { width: 3, offsetX: -1 },
        "(": { width: 4 },
        ")": { width: 4 },
        "!": { width: 3, offsetX: -1 },
        "'": { width: 3, offsetX: -1 },
        "`": { width: 4, offsetX: -1 },
        "|": { width: 3, offsetX: -1 },
        "[": { width: 4 },
        "]": { width: 4 },
        "ы": { width: 7, offsetX: 1 }
    } as IEctaFontPattern

})

export default config;