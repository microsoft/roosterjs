import { ColorKeyAndValue, DarkColorHandler, ModeIndependentColor } from 'roosterjs-editor-types';
import { getColor, getObjectKeys, parseColor, setColor } from 'roosterjs-editor-dom';

const VARIABLE_REGEX = /^\s*var\(\s*(\-\-[a-zA-Z0-9\-_]+)\s*(?:,\s*(.*))?\)\s*$/;
const VARIABLE_PREFIX = 'var(';
const COLOR_VAR_PREFIX = 'darkColor';

/**
 * @internal
 */
export default class DarkColorHandlerImpl implements DarkColorHandler {
    private knownColors: Record<string, Readonly<ModeIndependentColor>> = {};

    constructor(
        private contentDiv: HTMLElement,
        private getDarkColor?: (color: string) => string,
        private darkMode?: boolean,
        private onExternalContentTransform?: (
            element: HTMLElement,
            fromDarkMode: boolean,
            toDarkMode: boolean,
            darkColorHandler: DarkColorHandler
        ) => void
    ) {}

    get isDarkMode() {
        return !!this.darkMode;
    }

    set isDarkMode(value: boolean) {
        if (this.darkMode != value) {
            this.darkMode = value;

            this.resetContainerColors(this.darkMode);
        }
    }

    /**
     * Get a copy of known colors
     * @returns
     */
    getKnownColorsCopy() {
        return Object.values(this.knownColors);
    }

    /**
     * Given a light mode color value and an optional dark mode color value, register this color
     * so that editor can handle it, then return the CSS color value for current color mode.
     * @param lightModeColor Light mode color value
     * @param isDarkMode Whether current color mode is dark mode
     * @param darkModeColor Optional dark mode color value. If not passed, we will calculate one.
     */
    registerColor(lightModeColor: string, isDarkMode: boolean, darkModeColor?: string): string {
        const parsedColor = this.parseColorValue(lightModeColor, isDarkMode);

        lightModeColor = parsedColor.lightModeColor;
        darkModeColor = parsedColor.darkModeColor || darkModeColor;
        const colorKey =
            parsedColor.key || `--${COLOR_VAR_PREFIX}_${lightModeColor.replace(/[^\d\w]/g, '_')}`;

        if (lightModeColor && this.getDarkColor) {
            if (!this.knownColors[colorKey]) {
                darkModeColor = darkModeColor || this.getDarkColor(lightModeColor);

                this.knownColors[colorKey] = { lightModeColor, darkModeColor };

                if (this.isDarkMode) {
                    this.setColorVariable(colorKey, darkModeColor);
                }
            }

            return `${VARIABLE_PREFIX}${colorKey}, ${lightModeColor})`;
        } else {
            return lightModeColor;
        }
    }

    /**
     * Reset known color record, clean up registered color variables.
     */
    reset(): void {
        this.resetContainerColors(false /*isDarkMode*/);
    }

    /**
     * Parse an existing color value, if it is in variable-based color format, extract color key,
     * light color and query related dark color if any
     * @param color The color string to parse
     * @param isInDarkMode Whether current content is in dark mode. When set to true, if the color value is not in dark var format,
     * we will treat is as a dark mode color and try to find a matched dark mode color.
     */
    parseColorValue(color: string | undefined | null, isInDarkMode?: boolean): ColorKeyAndValue {
        let key: string | undefined;
        let lightModeColor = '';
        let darkModeColor: string | undefined;

        if (color) {
            const match = color.startsWith(VARIABLE_PREFIX) ? VARIABLE_REGEX.exec(color) : null;

            if (match) {
                if (match[2]) {
                    key = match[1];
                    lightModeColor = match[2];
                    darkModeColor = this.knownColors[key]?.darkModeColor;
                } else {
                    lightModeColor = '';
                }
            } else if (isInDarkMode) {
                // If editor is in dark mode but the color is not in dark color format, it is possible the color was inserted from external code
                // without any light color info. So we first try to see if there is a known dark color can match this color, and use its related
                // light color as light mode color. Otherwise we need to drop this color to avoid show "white on white" content.
                lightModeColor = this.findLightColorFromDarkColor(color) || '';

                if (lightModeColor) {
                    darkModeColor = color;
                }
            } else {
                lightModeColor = color;
            }
        }

        return { key, lightModeColor, darkModeColor };
    }

    /**
     * Find related light mode color from dark mode color.
     * @param darkColor The existing dark color
     */
    findLightColorFromDarkColor(darkColor: string): string | null {
        const rgbSearch = parseColor(darkColor);

        if (rgbSearch) {
            const key = getObjectKeys(this.knownColors).find(key => {
                const rgbCurrent = parseColor(this.knownColors[key].darkModeColor);

                return (
                    rgbCurrent &&
                    rgbCurrent[0] == rgbSearch[0] &&
                    rgbCurrent[1] == rgbSearch[1] &&
                    rgbCurrent[2] == rgbSearch[2]
                );
            });

            if (key) {
                return this.knownColors[key].lightModeColor;
            }
        }

        return null;
    }

    transformColors(root: HTMLElement, isCleaningUp: boolean, includeSelf: boolean) {
        this.iterateElements(root, includeSelf, element => {
            if (!isCleaningUp && this.onExternalContentTransform) {
                this.onExternalContentTransform(element, isCleaningUp, !isCleaningUp, this);
            } else {
                this.transformElementColor(element, isCleaningUp, !isCleaningUp);
            }
        });
    }

    private setColorVariable(key: string, darkModeColor: string | null) {
        if (this.contentDiv) {
            if (darkModeColor) {
                this.contentDiv.style.setProperty(key, darkModeColor);
            } else {
                this.contentDiv.style.removeProperty(key);
            }
        }
    }

    private resetContainerColors(isDarkMode: boolean) {
        getObjectKeys(this.knownColors).forEach(key => {
            this.setColorVariable(key, isDarkMode ? this.knownColors[key].darkModeColor : null);
        });
    }

    private iterateElements(
        root: Node,
        includeSelf: boolean,
        transformer: (element: HTMLElement) => void
    ) {
        if (includeSelf && this.isHTMLElement(root)) {
            transformer(root);
        }

        for (let child = root.firstChild; child; child = child.nextSibling) {
            if (this.isHTMLElement(child)) {
                transformer(child);
            }

            this.iterateElements(child, false /*includeSelf*/, transformer);
        }
    }

    private isHTMLElement(node: Node): node is HTMLElement {
        // This is not a strict check, we just need to make sure this element has style so that we can set style to it
        // We don't use safeInstanceOf() here since this function will be called very frequently when extract html content
        // in dark mode, so we need to make sure this check is fast enough
        const htmlElement = <HTMLElement>node;
        return node.nodeType == Node.ELEMENT_NODE && !!htmlElement.style;
    }

    /**
     * Transform element color, from dark to light or from light to dark
     * @param element The element to transform color
     * @param fromDarkMode Whether this is transforming color from dark mode
     * @param toDarkMode Whether this is transforming color to dark mode
     */
    transformElementColor(element: HTMLElement, fromDarkMode: boolean, toDarkMode: boolean): void {
        [false, true].forEach(isBackground => {
            const color = getColor(element, isBackground, this, !toDarkMode);

            element.style.setProperty(isBackground ? 'background-color' : 'color', null);
            element.removeAttribute(isBackground ? 'bgcolor' : 'color');

            if (color && color != 'inherit') {
                setColor(
                    element,
                    color,
                    isBackground,
                    fromDarkMode,
                    false /*adjustTextColor*/,
                    toDarkMode ? this : null
                );
            }
        });
    }
}
