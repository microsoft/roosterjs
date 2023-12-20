import { GetContentMode, PluginEventType } from 'roosterjs-editor-types';
import { transformColor } from 'roosterjs-content-model-core';
import {
    createRange,
    getHtmlWithSelectionPath,
    getSelectionPath,
    getTextContent,
    safeInstanceOf,
} from 'roosterjs-editor-dom';
import type { GetContent } from '../publicTypes/ContentModelEditorCore';

/**
 * @internal
 * Get current editor content as HTML string
 * @param core The StandaloneEditorCore object
 * @param mode specify what kind of HTML content to retrieve
 * @returns HTML string representing current editor content
 */
export const getContent: GetContent = (core, mode): string => {
    let content: string | null = '';
    const triggerExtractContentEvent = mode == GetContentMode.CleanHTML;
    const includeSelectionMarker = mode == GetContentMode.RawHTMLWithSelection;
    const { standaloneEditorCore } = core;
    const { lifecycle, contentDiv, api, darkColorHandler } = standaloneEditorCore;

    // When there is fragment for shadow edit, always use the cached fragment as document since HTML node in editor
    // has been changed by uncommitted shadow edit which should be ignored.
    const root = lifecycle.shadowEditFragment || contentDiv;

    if (mode == GetContentMode.PlainTextFast) {
        content = root.textContent;
    } else if (mode == GetContentMode.PlainText) {
        content = getTextContent(root);
    } else {
        const clonedRoot = cloneNode(root);
        clonedRoot.normalize();

        const originalRange = api.getDOMSelection(standaloneEditorCore);
        const path =
            !includeSelectionMarker || lifecycle.shadowEditFragment
                ? null
                : originalRange?.type == 'range'
                ? getSelectionPath(contentDiv, originalRange.range)
                : null;
        const range = path && createRange(clonedRoot, path.start, path.end);

        if (lifecycle.isDarkMode) {
            transformColor(clonedRoot, false /*includeSelf*/, 'darkToLight', darkColorHandler);
        }

        if (triggerExtractContentEvent) {
            api.triggerEvent(
                standaloneEditorCore,
                {
                    eventType: PluginEventType.ExtractContentWithDom,
                    clonedRoot,
                },
                true /*broadcast*/
            );

            content = clonedRoot.innerHTML;
        } else if (range) {
            // range is not null, which means we want to include a selection path in the content
            content = getHtmlWithSelectionPath(clonedRoot, range);
        } else {
            content = clonedRoot.innerHTML;
        }
    }

    return content ?? '';
};

function cloneNode(node: HTMLElement | DocumentFragment): HTMLElement {
    let clonedNode: HTMLElement;
    if (safeInstanceOf(node, 'DocumentFragment')) {
        clonedNode = node.ownerDocument.createElement('div');
        clonedNode.appendChild(node.cloneNode(true /*deep*/));
    } else {
        clonedNode = node.cloneNode(true /*deep*/) as HTMLElement;
    }

    return clonedNode;
}
