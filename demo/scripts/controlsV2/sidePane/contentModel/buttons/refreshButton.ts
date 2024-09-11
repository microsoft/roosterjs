import { ContentModelPanePlugin } from '../ContentModelPanePlugin';
import type { RibbonButton } from 'roosterjs-react';

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
