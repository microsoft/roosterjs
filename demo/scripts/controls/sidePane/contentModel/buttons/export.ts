import { RibbonButton } from 'roosterjs-react';

export function getExportButton(onClick: () => void): RibbonButton<'buttonNameExport'> {
    return {
        key: 'buttonNameExport',
        unlocalizedText: 'Create DOM tree',
        iconName: 'DOM',
        onClick,
    };
}
