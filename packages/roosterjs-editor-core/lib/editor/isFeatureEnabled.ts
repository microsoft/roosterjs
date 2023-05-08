import { ExperimentalFeatures } from 'roosterjs-editor-types';
import type { CompatibleExperimentalFeatures } from 'roosterjs-editor-types/lib/compatibleTypes';

/**
 * Check if the given experimental feature is enabled
 * @param featureSet All enabled features
 * @param feature The feature to check
 * @returns True if the given feature is enabled, otherwise false
 */
export function isFeatureEnabled(
    featureSet: (ExperimentalFeatures | CompatibleExperimentalFeatures)[] | undefined,
    feature: ExperimentalFeatures | CompatibleExperimentalFeatures
) {
    return (featureSet || []).indexOf(feature) >= 0;
}
