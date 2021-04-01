/**
 * Color object containing various color hex values.
 *
 * To add transparency values correctly, we need to specify
 * the full color values without shortcuts.
 */
export const color = {
    white: "#ffffff",
    black: "#000000",
    smoke: "#f1f1f1",
    grey: {
        /** Mixture with white */
        tint: {
            lightest: "#eeeeee",
            lighter: "#dddddd",
            light: "#cccccc",
            neutral: "#bbbbbb",
            dark: "#aaaaaa",
            darker: "#999999",
            darkest: "#888888",
        },
        /** Mixture with black */
        shade: {
            lightest: "#777777",
            lighter: "#666666",
            light: "#555555",
            neutral: "#444444",
            dark: "#333333",
            darker: "#222222",
            darkest: "#111111",
        },
    },
    blue: {
        lightest: "#6ecbff",
        lighter: "#41c9fe",
        light: "#3ebaff",
        neutral: "#4196fe",
        dark: "#3983de",
        darker: "#3273c2",
        darkest: "#1f4879",
    },
    purple: {
        lightest: "#db9ffc",
        lighter: "#c565fb",
        light: "#d841fe",
        neutral: "#a941fe",
        dark: "#9439de",
        darker: "#6a299f",
        darkest: "#3f185f",
    },
    pink: {
        lightest: "#ffc1e3",
        lighter: "#fe97d1",
        light: "#fe6ebe",
        neutral: "#fe59b5",
        dark: "#de4e9e",
        darker: "#f34196",
        darkest: "#b63171",
    },
    orange: {
        lightest: "#ffd2a0",
        lighter: "#ffc788",
        light: "#ffbc71",
        neutral: "#ffb159",
        dark: "#ffa641",
        darker: "#ee9b3d",
        darkest: "#bf7e35",
    },
    red: {
        lightest: "#ec8b8c",
        lighter: "#f16b6c",
        light: "#e66465",
        neutral: "#ef5657",
        dark: "#d14b4c",
        darker: "#b34141",
        darkest: "#772b2b",
    },
};

/**
 * Transparency object containing hex values for adding transparency.
 *
 * Simply add the transparency to the end of the hex value.
 *
 * @example
 * // Adds 80% transparency to color
 * input: ${color.purple.neutral + transparency.x80}
 * output: #a941fecc
 */
export const transparency = {
    x100: "ff",
    x99: "fc",
    x98: "fa",
    x97: "f7",
    x96: "f5",
    x95: "f2",
    x94: "f0",
    x93: "ed",
    x92: "eb",
    x91: "e8",
    x90: "e6",
    x89: "e3",
    x88: "e0",
    x87: "de",
    x86: "db",
    x85: "d9",
    x84: "d6",
    x83: "d4",
    x82: "d1",
    x81: "cf",
    x80: "cc",
    x79: "c9",
    x78: "c7",
    x77: "c4",
    x76: "c2",
    x75: "bf",
    x74: "bd",
    x73: "ba",
    x72: "b8",
    x71: "b5",
    x70: "b3",
    x69: "b0",
    x68: "ad",
    x67: "ab",
    x66: "a8",
    x65: "a6",
    x64: "a3",
    x63: "a1",
    x62: "9e",
    x61: "9c",
    x60: "99",
    x59: "96",
    x58: "94",
    x57: "91",
    x56: "8f",
    x55: "8c",
    x54: "8a",
    x53: "87",
    x52: "85",
    x51: "82",
    x50: "80",
    x49: "7d",
    x48: "7a",
    x47: "78",
    x46: "75",
    x45: "73",
    x44: "70",
    x43: "6e",
    x42: "6b",
    x41: "69",
    x40: "66",
    x39: "63",
    x38: "61",
    x37: "5e",
    x36: "5c",
    x35: "59",
    x34: "57",
    x33: "54",
    x32: "52",
    x31: "4f",
    x30: "4d",
    x29: "4a",
    x28: "47",
    x27: "45",
    x26: "42",
    x25: "40",
    x24: "3d",
    x23: "3b",
    x22: "38",
    x21: "36",
    x20: "33",
    x19: "30",
    x18: "2e",
    x17: "2b",
    x16: "29",
    x15: "26",
    x14: "24",
    x13: "21",
    x12: "1f",
    x11: "1c",
    x10: "1a",
    x9: "17",
    x8: "14",
    x7: "12",
    x6: "0f",
    x5: "0d",
    x4: "0a",
    x3: "08",
    x2: "05",
    x1: "03",
    x0: "00",
};

/**
 * Function to handle which color the property should be.
 *
 * Created as a universal color selector. It takes either the direct hex color,
 * or the color phrase indicated as the specified color.
 *
 * @param {String} input string to process
 * @return {String} the color to display
 *
 * @example
 * // Returns black color
 * handleColor("#000000")
 * output: "#000000"
 *
 * @example
 * // Returns purple neutral with 75% transparency
 * handleColor(color.purple.neutral + transparency.x75)
 * output: "#a941febf"
 *
 * @example
 * // Returns darker orange with 30% transparency
 * handleColor("orange-dark-x30")
 * output: "#ee9b3d4d"
 */
export const handleColor = (input) => {
    let targetTransparency;
    /** Check if hex value is already provided, if so return it */
    if (typeof input === "string" && input.indexOf("#") !== -1) {
        return input;
    /** Check if the color should inherit */
    } else if (input === "inherit") {
        return input;
    } else if (input === "transparent") {
        return input;
    } else if (typeof input === "string") {
        /** Extract the transparency value if it exists */
        const res = input.split("-x");
        input = res[0];
        res.length > 1 ?
            targetTransparency = transparency[`x${res[1]}`] :
            targetTransparency = "";

        /** Extract the chosen color recursively */
        const selectors = input.split("-");
        let targetColor = color;
        selectors.map((item) => {
            targetColor = targetColor[item];
        });

        return targetColor + targetTransparency;
    } else {
        /** Just return the input (useful if selected "red", "green" etc.) */
        return input;
    }
};
