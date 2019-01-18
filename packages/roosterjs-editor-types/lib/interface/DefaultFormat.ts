/**
 * Default format settings
 */
interface DefaultFormat {
    /**
     * Font family
     */
    fontFamily?: string;

    /**
     * Font size
     */
    fontSize?: string;

    /**
     * Text color
     */
    textColor?: string;

    /**
     * Background Color
     */
    backgroundColor?: string;

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

    /**
     * original source background, used for converting back to light mode
     */
    ogsb?: string;

     /**
      * original source color, used for converting back to light mode
      */
    ogsc?: string;
}

export default DefaultFormat;
