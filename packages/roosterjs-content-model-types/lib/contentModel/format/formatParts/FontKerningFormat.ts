/**
 * Font kerning and Word's minimum kerning font size
 */
export type FontKerningFormat = {
    /**
     * CSS font-kerning value
     */
    fontKerning?: string;

    /**
     * Word's kerning threshold in points. Zero disables kerning.
     */
    wordKerningThreshold?: string;
};
