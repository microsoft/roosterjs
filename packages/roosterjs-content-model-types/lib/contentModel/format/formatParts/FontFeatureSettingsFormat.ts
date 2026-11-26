/**
 * OpenType feature settings and independent Word stylistic-set overrides
 */
export type FontFeatureSettingsFormat = {
    /**
     * CSS font-feature-settings value
     */
    fontFeatureSettings?: string;

    /**
     * Word's ss01 through ss20 overrides, independently of other OpenType features
     */
    wordStylisticSetFeatures?: string;
};
