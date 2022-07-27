import { RibbonButton } from 'roosterjs-react';

export function getRefreshButton(onClick: () => void): RibbonButton<'buttonNameRefresh'> {
    return {
        key: 'buttonNameRefresh',
        unlocalizedText: 'Refresh',
        iconName: 'Refresh',
        onClick,
    };
}
