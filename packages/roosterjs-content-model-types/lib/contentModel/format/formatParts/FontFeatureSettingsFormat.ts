/**
 * OpenType feature settings and independent Word contextual-alternate overrides
 */
export type FontFeatureSettingsFormat = {
    /**
     * CSS font-feature-settings value
     */
    fontFeatureSettings?: string;

    /**
     * Word's calt override, independently of its ligature features
     */
    wordContextualAlternates?: string;
};
