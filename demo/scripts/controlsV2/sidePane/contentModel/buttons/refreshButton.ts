import { ContentModelPanePlugin } from '../ContentModelPanePlugin';
import { RibbonButton } from '../../../roosterjsReact/ribbon';

export function getRefreshButton(
    plugin: ContentModelPanePlugin
): RibbonButton<'buttonNameRefresh'> {
    return {
        key: 'buttonNameRefresh',
        unlocalizedText: 'Refresh',
        iconName: 'Refresh',
        onClick: () => {
            plugin.onModelChange(true /*force*/);
        },
    };
}
