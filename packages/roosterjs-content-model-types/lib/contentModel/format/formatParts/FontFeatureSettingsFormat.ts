/**
 * OpenType feature settings and independent Word ligature overrides
 */
export type FontFeatureSettingsFormat = {
    /**
     * CSS font-feature-settings value
     */
    fontFeatureSettings?: string;

    /**
     * Word's liga/clig/hlig/dlig overrides, without changing contextual alternates
     */
    wordLigatureFeatures?: string;
};
