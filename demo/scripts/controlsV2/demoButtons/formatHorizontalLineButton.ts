import * as React from 'react';
import { formatHorizontalLine } from 'roosterjs-content-model-api';
import { FormatHorizontalLineDialog } from './FormatHorizontalLineDialog';
import type { RibbonButton } from 'roosterjs-react';

/**
 * @internal
 * Format selected horizontal lines from the demo ribbon.
 */
export const formatHorizontalLineButton: RibbonButton<'buttonNameFormatHorizontalLine'> = {
    key: 'buttonNameFormatHorizontalLine',
    unlocalizedText: 'Format horizontal line',
    iconName: 'GripperBarHorizontal',
    onClick: (editor, _, strings, uiUtilities) => {
        editor.focus();
        const selection = editor.getDOMSelection();
        const domHelper = editor.getDOMHelper();
        // The resize plugin can unwrap or replace a selected HR when the dialog takes focus.
        const selectedLineIndexes =
            selection?.type == 'range' && !selection.range.collapsed
                ? domHelper
                      .queryElements('hr')
                      .map((line, index) => (selection.range.intersectsNode(line) ? index : -1))
                      .filter(index => index >= 0)
                : [];
        const close = () => {
            dispose();
            editor.focus();
            if (selectedLineIndexes.length > 0) {
                const lines = domHelper.queryElements('hr');
                const range = editor.getDocument().createRange();
                range.setStartBefore(lines[selectedLineIndexes[0]]);
                range.setEndAfter(lines[selectedLineIndexes[selectedLineIndexes.length - 1]]);
                editor.setDOMSelection({
                    type: 'range',
                    range,
                    isReverted: selection?.type == 'range' && selection.isReverted,
                });
            } else {
                editor.setDOMSelection(selection);
            }
        };

        const dispose = uiUtilities.renderComponent(
            React.createElement(FormatHorizontalLineDialog, {
                doc: editor.getDocument(),
                onCancel: close,
                onApply: format => {
                    close();
                    formatHorizontalLine(editor, format);
                },
            })
        );
    },
};
