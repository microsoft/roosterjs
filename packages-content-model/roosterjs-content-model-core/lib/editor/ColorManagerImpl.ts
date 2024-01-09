import type { ColorManager, ColorTransformFunction, Colors } from 'roosterjs-content-model-types';

class ColorManagerImpl implements ColorManager {
    constructor(
        private readonly root: HTMLElement,
        public readonly knownColors: Record<string, Colors>,
        public getDarkColor: ColorTransformFunction
    ) {}

    updateKnownColor(isDarkMode: boolean, key?: string, colorPair?: Colors): void {
        if (key && colorPair) {
            this.updateColorInternal(isDarkMode, key, colorPair, false /*removeWhenLight*/);
        } else {
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
        this.knownColors[key] = colorPair;

        if (isDarkMode) {
            this.root.style.setProperty(key, colorPair.darkModeColor);
        } else if (removeWhenLight) {
            this.root.style.removeProperty(key);
        }
    }
}

const defaultGetDarkColor: ColorTransformFunction = color => {
    // TODO: Add an implementation for default light to dark conversion
    return color;
};

/**
 * @internal
 */
export function createColorManager(
    root: HTMLElement,
    knownColors: Record<string, Colors> = {},
    getDarkColor: ColorTransformFunction = defaultGetDarkColor
): ColorManager {
    return new ColorManagerImpl(root, knownColors, getDarkColor);
}
