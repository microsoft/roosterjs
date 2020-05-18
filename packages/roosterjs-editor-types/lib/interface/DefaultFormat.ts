import ModeIndependentColor from './ModeIndependentColor';

/**
 * Default format settings
 */
export default interface DefaultFormat {
    /**
     * Font family
     */
    fontFamily?: string;

    /**
     * Font size
     */
    fontSize?: string;

    /**
     * Single text color (for non dark mode/single mode editor)
     */
    textColor?: string;

    /**
     * Text color light/dark mode pair
     */
    textColors?: ModeIndependentColor;

    /**
     * Single background color (for non dark mode/single mode editor)
     */
    backgroundColor?: string;

    /**
     * Background color light/dark mode pair
     */
    backgroundColors?: ModeIndependentColor;

    /**
     * Whether is bold
     */
    bold?: boolean;

    /**
     * Whether is italic
     */
    italic?: boolean;

    /**
     * Whether has underline
     */
    underline?: boolean;
}
