import { CustomReplace, ImageEdit } from 'roosterjs-editor-plugins';
import { LegacyPluginList, OptionState } from '../sidePane/editorOptions/OptionState';
import { EditorPlugin as LegacyEditorPlugin } from 'roosterjs-editor-types';

export function createLegacyPlugins(initState: OptionState): LegacyEditorPlugin[] {
    const { pluginList } = initState;

    const plugins: Record<keyof LegacyPluginList, LegacyEditorPlugin | null> = {
        imageEdit: pluginList.imageEdit
            ? new ImageEdit({
                  preserveRatio: initState.forcePreserveRatio,
                  applyChangesOnMouseUp: initState.applyChangesOnMouseUp,
              })
            : null,
        customReplace: pluginList.customReplace ? new CustomReplace() : null,
    };

    return Object.values(plugins).filter(x => !!x);
}
