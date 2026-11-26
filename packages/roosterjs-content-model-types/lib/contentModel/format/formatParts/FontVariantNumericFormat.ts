/**
 * Format for numeric font variants
 */
export type FontVariantNumericFormat = {
    /**
     * CSS font-variant-numeric value
     */
    fontVariantNumeric?: string;

    /**
     * Word numeral form, kept independent of other numeric variants
     */
    wordNumberForm?: 'default' | 'lining' | 'oldstyle' | '';
};
