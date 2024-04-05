import { Announce, ContentEdit, CustomReplace, ImageEdit } from 'roosterjs-editor-plugins';
import { EditorPlugin as LegacyEditorPlugin, KnownAnnounceStrings } from 'roosterjs-editor-types';
import { LegacyPluginList, OptionState } from '../sidePane/editorOptions/OptionState';

export function createLegacyPlugins(initState: OptionState): LegacyEditorPlugin[] {
    const { pluginList } = initState;

    const plugins: Record<keyof LegacyPluginList, LegacyEditorPlugin | null> = {
        contentEdit: pluginList.contentEdit ? new ContentEdit(initState.contentEditFeatures) : null,
        imageEdit: pluginList.imageEdit
            ? new ImageEdit({
                  preserveRatio: initState.forcePreserveRatio,
                  applyChangesOnMouseUp: initState.applyChangesOnMouseUp,
              })
            : null,
        customReplace: pluginList.customReplace ? new CustomReplace() : null,
        announce: pluginList.announce ? new Announce(getDefaultStringsMap()) : null,
    };

    return Object.values(plugins).filter(x => !!x);
}

function getDefaultStringsMap(): Map<KnownAnnounceStrings, string> {
    return new Map<KnownAnnounceStrings, string>([
        [KnownAnnounceStrings.AnnounceListItemBullet, 'Autocorrected Bullet'],
        [KnownAnnounceStrings.AnnounceListItemNumbering, 'Autocorrected {0}'],
        [
            KnownAnnounceStrings.AnnounceOnFocusLastCell,
            'Warning, pressing tab here adds an extra row.',
        ],
    ]);
}
