/**
 * Predefined experiment features
 * By default these features are not enabled. To enable them, pass the feature name into EditorOptions.experimentalFeatures
 * when create editor
 */
export type ExperimentalFeature =
    /**
     * When this feature is enabled, we will persist a content model in memory as long as we can,
     * and use cached element when write back if it is not changed.
     */
    'PersistCache';

/**
 * Workaround for the Legacy Image Edit
 */
'PreserveImageSelection';
