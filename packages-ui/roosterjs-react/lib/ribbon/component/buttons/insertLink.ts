import RibbonButton from '../../type/RibbonButton';
import showInputDialog from '../../../inputDialog/utils/showInputDialog';
import { createLink } from 'roosterjs-editor-api';
import { InsertLinkButtonStringKey } from '../../type/RibbonButtonStringKeys';
import { QueryScope } from 'roosterjs-editor-types';

/**
 * @internal
 * "Insert link" button on the format ribbon
 */
export const insertLink: RibbonButton<InsertLinkButtonStringKey> = {
    key: 'buttonNameInsertLink',
    unlocalizedText: 'Insert link',
    iconName: 'Link',
    isDisabled: formatState => !!formatState.isMultilineSelection,
    onClick: (editor, _, strings, uiUtilities) => {
        const existingLink = editor.queryElements<HTMLAnchorElement>(
            'a[href]',
            QueryScope.OnSelection
        )[0];
        const url = existingLink?.href || '';
        const displayText =
            existingLink?.textContent || editor.getSelectionRange()?.toString() || '';
        const items = {
            url: {
                autoFocus: true,
                labelKey: 'insertLinkDialogUrl' as const,
                unlocalizedLabel: 'Web address (URL)',
                initValue: url,
            },
            displayText: {
                labelKey: 'insertLinkDialogDisplayAs' as const,
                unlocalizedLabel: 'Display as',
                initValue: displayText,
            },
        };

        showInputDialog(
            uiUtilities,
            'insertLinkTitle',
            'Insert link',
            items,
            strings,
            (itemName, newValue, values) => {
                if (itemName == 'url' && values.displayText == values.url) {
                    values.displayText = newValue;
                    values.url = newValue;
                    return values;
                } else {
                    return null;
                }
            }
        ).then(result => {
            editor.focus();

            if (
                result &&
                result.displayText &&
                result.url &&
                (result.displayText != displayText || result.url != url)
            ) {
                createLink(editor, result.url, result.url, result.displayText);
            }
        });
    },
};
