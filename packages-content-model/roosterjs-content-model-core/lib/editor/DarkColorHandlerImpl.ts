import type {
    DarkColorHandler,
    ColorTransformFunction,
    Colors,
} from 'roosterjs-content-model-types';

class DarkColorHandlerImpl implements DarkColorHandler {
    constructor(
        private readonly root: HTMLElement,
        public getDarkColor: ColorTransformFunction,
        public readonly knownColors: Record<string, Colors>
    ) {}

    updateKnownColor(isDarkMode: boolean, key?: string, colorPair?: Colors): void {
        if (key && colorPair) {
            // Has values to set
            // When in light mode: Update the value to known values, do not touch container property
            // When in dark mode: Update the value to known colors, set value to container
            this.updateColorInternal(isDarkMode, key, colorPair, false /*removeWhenLight*/);
        } else {
            // No value to set
            // When in light mode: Remove existing value from container, do not touch known values
            // When in dark mode: Set all values to container, do not touch known values
            Object.keys(this.knownColors).forEach(key => {
                this.updateColorInternal(
                    isDarkMode,
                    key,
                    this.knownColors[key],
                    true /*removeWhenLight*/
                );
            });
        }
    }

    private updateColorInternal(
        isDarkMode: boolean,
        key: string,
        colorPair: Colors,
        removeWhenLight: boolean
    ) {
        if (!this.knownColors[key]) {
            this.knownColors[key] = colorPair;
        }

        if (isDarkMode) {
            this.root.style.setProperty(key, colorPair.darkModeColor);
        } else if (removeWhenLight) {
            this.root.style.removeProperty(key);
        }
    }
}

/**
 * @internal
 */
export function createDarkColorHandler(
    root: HTMLElement,
    getDarkColor: ColorTransformFunction,
    knownColors: Record<string, Colors> = {}
): DarkColorHandler {
    return new DarkColorHandlerImpl(root, getDarkColor, knownColors);
}
