import type {
    DarkColorHandler,
    ColorTransformFunction,
    Colors,
} from 'roosterjs-content-model-types';

class DarkColorHandlerImpl implements DarkColorHandler {
    constructor(
        private readonly root: HTMLElement,
        public getDarkColor: ColorTransformFunction,
        public readonly knownColors: Record<string, Colors>,
        public readonly skipKnownColorsWhenGetDarkColor: boolean
    ) {}

    updateKnownColor(isDarkMode: boolean, key?: string, colorPair?: Colors): void {
        if (key && colorPair) {
            // Has values to set
            // When in light mode: Update the value to known values, do not touch container property
            // When in dark mode: Update the value to known colors, set value to container
            if (!this.knownColors[key]) {
                this.knownColors[key] = colorPair;
            }

            if (isDarkMode) {
                this.root.style.setProperty(key, colorPair.darkModeColor);
            }
        } else {
            // No value to set
            // When in light mode: No op
            // When in dark mode: Set all values to container, do not touch known values
            if (isDarkMode) {
                Object.keys(this.knownColors).forEach(key => {
                    this.root.style.setProperty(key, this.knownColors[key].darkModeColor);
                });
            }
        }
    }

    reset() {
        Object.keys(this.knownColors).forEach(key => {
            this.root.style.removeProperty(key);
        });
    }
}

/**
 * @internal
 */
export function createDarkColorHandler(
           root: HTMLElement,
           getDarkColor: ColorTransformFunction,
           knownColors: Record<string, Colors> = {},
           skipKnownColorsWhenGetDarkColor: boolean = false
       ): DarkColorHandler {
           return new DarkColorHandlerImpl(
               root,
               getDarkColor,
               knownColors,
               skipKnownColorsWhenGetDarkColor
           );
       }
