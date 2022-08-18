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
    
    DEFAULT_FONT: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE4AAAAwCAYAAAC/gkysAAAC10lEQVRoge1a0XLDIAyD3P7/l7OXsaPMki3jNL1d9NLVOEIxxg7pWnuQQmeD53merbXWe++WfR3z7FU8lr333sen5480MZ71+qM5GESWHflbY4wH+St2pAVpjXIguIGzbnbYdyf3+Ct4Mnoi9xXKOGSvEMv40TXKDoheP/NE7ssNnDr5+YNdf3Ve5qvoYVxVWf2AZQmzr2N32ufPd9gPy2FGpqtW2dcx1iXfjXSNQ8jUDisQV9cUliRIz/z9mC+qEKQ8Zw3/VZTKUYURtIie8q6qikK+FZnLMmiMK/yKngcAvbV7z5gq/5y1YyziH7EjTZbtGAb1hICuUbpkhl/hVsG29Rgffx+zMdJNIvaqm1htVrZ5ehj/js7DI8lkYkUhRYtobU+mk/ErOlf+r1mUIkDNxCxPRA/iqFrEB9UYq7Kuzjnh3XamR9Gfta8+69xb7+NUu/WAyq5B+ITt99JVKwjv4PFOCMg/r+4DzqoKB8rQEbSdLqki/ZuDClSflHkzWtSgsnmfLl0F1tms7yjqma6X6cJoXoVnV8/vWdUKhIpRm1g6r2NKd86cgzMnigjX1zw472XrO/Nd7ch/FVNRM5SFitrRfQ37S3NAz1kWKp7vRuFGcyjwOnHUN6r/T8bNDupKsgxV4dVKLyMQhzpnlusBQ7a7fdIqVGph2R66gLXt1ASG79UL4G15xT81yWr7rxlaEji2MulJFl81oIoWj+OyjLszg9QAVQZ0l+eBB7ZamZVEWx75KZnO/FWdUT2W7fesqk6Arhljsw35eg/K7Khn+arbqWT7ZbJOFaIUXjXjFP7SGs0mrSiwmaCpW3hXowz1BlQ+L5hKprAxZXEe3I2KWpDJTCV70JiXbUpNjOLlV66ViL2fsibNdDblTS8aZ923IkgW6IvMKybcwXnyfw6Kah0cO+8NQ7/kV72l3QULzhpUlJW7HTmMDLHyGHFljUP61dpt4RvafJj/xUhsogAAAABJRU5ErkJggg==",
    DEFAULT_FONT_MAPPING: " abcdefghijklmnopqrstuvwxyzабвгдежзиклмнопрстуфхцчшщъыьэюя0123456789+-=.,;:*/()&^<>%$#@!~\"'`?|\\_[]{}",
    DEFAULT_FONT_PATTERN: {
        " ": { width: 4 },
        ".": { width: 3, offsetX: -1 },
        ",": { width: 3, offsetX: -1, offsetY: 1 },
        ";": { width: 3, offsetX: -1, offsetY: 1 },
        ":": { width: 3, offsetX: -1 },
        "(": { width: 4 },
        ")": { width: 4 },
        "!": { width: 3, offsetX: -1 },
        "'": { width: 3, offsetX: -1 },
        "`": { width: 4, offsetX: -1 },
        "|": { width: 3, offsetX: -1 },
        "[": { width: 4 },
        "]": { width: 4 },
        "ы": { width: 7, offsetX: 1 },
        "ж": { width: 6 },
        "щ": { width: 7, offsetX: 1 },
        "ш": { width: 6 },
        "ц": { width: 6 },
    } as IEctaFontPattern

})

export default config;