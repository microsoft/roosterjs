/**
 * Format for numeric font variants
 */
export type FontVariantNumericFormat = {
    /**
     * CSS font-variant-numeric value
     */
    fontVariantNumeric?: string;

    /**
     * Word numeral spacing, kept independent of other numeric variants
     */
    wordNumberSpacing?: 'default' | 'tabular' | 'proportional' | '';
};
