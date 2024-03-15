import { EditorPlugin as LegacyEditorPlugin, KnownAnnounceStrings } from 'roosterjs-editor-types';
import {
    Announce,
    ContentEdit,
    CustomReplace,
    HyperLink,
    ImageEdit,
    TableCellSelection,
    Watermark,
} from 'roosterjs-editor-plugins';
import {
    LegacyPluginList,
    OptionState,
    UrlPlaceholder,
} from '../sidePane/editorOptions/OptionState';

export function createLegacyPlugins(initState: OptionState): LegacyEditorPlugin[] {
    const { pluginList, linkTitle } = initState;

    const plugins: Record<keyof LegacyPluginList, LegacyEditorPlugin | null> = {
        contentEdit: pluginList.contentEdit ? new ContentEdit(initState.contentEditFeatures) : null,
        hyperlink: pluginList.hyperlink
            ? new HyperLink(
                  linkTitle?.indexOf(UrlPlaceholder) >= 0
                      ? url => linkTitle.replace(UrlPlaceholder, url)
                      : linkTitle
                      ? () => linkTitle
                      : null
              )
            : null,
        watermark: pluginList.watermark ? new Watermark(initState.watermarkText) : null,
        imageEdit: pluginList.imageEdit
            ? new ImageEdit({
                  preserveRatio: initState.forcePreserveRatio,
                  applyChangesOnMouseUp: initState.applyChangesOnMouseUp,
              })
            : null,
        tableCellSelection: pluginList.tableCellSelection ? new TableCellSelection() : null,
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
