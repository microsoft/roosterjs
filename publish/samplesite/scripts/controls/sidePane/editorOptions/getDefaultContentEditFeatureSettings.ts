import {
    getAllContentEditFeatures,
    ContentEditFeatureSettings,
} from 'roosterjs-editor-plugins/lib/EditFeatures';

export default function getDefaultContentEditFeatureSettings() {
    const allFeatures = getAllContentEditFeatures();
    return Object.keys(allFeatures).reduce(
        (settings: ContentEditFeatureSettings, key: keyof ContentEditFeatureSettings) => {
            settings[key] = !allFeatures[key].defaultDisabled;
            return settings;
        },
        <ContentEditFeatureSettings>{}
    );
}
