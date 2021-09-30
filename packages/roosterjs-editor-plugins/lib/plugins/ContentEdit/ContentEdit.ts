import getAllFeatures from './getAllFeatures';
import {
    ContentEditFeatureSettings,
    EditorPlugin,
    GenericContentEditFeature,
    IEditor,
    PluginEvent,
} from 'roosterjs-editor-types';

/**
 * An editor plugin to handle content edit event.
 * The following cases are included:
 * 1. Auto increase/decrease indentation on Tab, Shift+tab
 * 2. Enter, Backspace on empty list item
 * 3. Enter, Backspace on empty blockquote line
 * 4. Auto bullet/numbering
 * 5. Auto link
 * 6. Tab in table
 * 7. Up/Down in table
 * 8. Manage list style
 */
export default class ContentEdit implements EditorPlugin {
    /**
     * Create instance of ContentEdit plugin
     * @param settingsOverride An optional feature set to override default feature settings
     * @param additionalFeatures Optional. More features to add
     */
    constructor(
        private settingsOverride?: Partial<ContentEditFeatureSettings>,
        private additionalFeatures?: GenericContentEditFeature<PluginEvent>[]
    ) {}

    /**
     * Get a friendly name of  this plugin
     */
    getName() {
        return 'ContentEdit';
    }

    /**
     * Initialize this plugin
     * @param editor The editor instance
     */
    initialize(editor: IEditor): void {
        const features: GenericContentEditFeature<PluginEvent>[] = [];
        const allFeatures = getAllFeatures();

        Object.keys(allFeatures).forEach((key: keyof typeof allFeatures) => {
            const feature = allFeatures[key];
            const hasSettingForKey =
                this.settingsOverride && this.settingsOverride[key] !== undefined;

            if (
                (hasSettingForKey && this.settingsOverride[key]) ||
                (!hasSettingForKey && !feature.defaultDisabled)
            ) {
                features.push(feature);
            }
        });

        features
            .concat(this.additionalFeatures || [])
            .forEach(feature => editor.addContentEditFeature(feature));
    }

    /**
     * Dispose this plugin
     */
    dispose(): void {}
}
