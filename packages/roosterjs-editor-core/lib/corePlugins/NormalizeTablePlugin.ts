import {
    changeElementTag,
    getComputedStyle,
    getTagOfNode,
    moveChildNodes,
    safeInstanceOf,
    toArray,
} from 'roosterjs-editor-dom';
import {
    EditorPlugin,
    ExperimentalFeatures,
    IEditor,
    PluginEvent,
    PluginEventType,
    SelectionRangeTypes,
} from 'roosterjs-editor-types';

/**
 * @internal
 * TODO: Rename this plugin since it is not only for table now
 *
 * NormalizeTable plugin makes sure each table in editor has TBODY/THEAD/TFOOT tag around TR tags
 *
 * When we retrieve HTML content using innerHTML, browser will always add TBODY around TR nodes if there is not.
 * This causes some issue when we restore the HTML content with selection path since the selection path is
 * deeply coupled with DOM structure. So we need to always make sure there is already TBODY tag whenever
 * new table is inserted, to make sure the selection path we created is correct.
 */
export default class NormalizeTablePlugin implements EditorPlugin {
    private editor: IEditor;

    /**
     * Get a friendly name of this plugin
     */
    getName() {
        return 'NormalizeTable';
    }

    /**
     * The first method that editor will call to a plugin when editor is initializing.
     * It will pass in the editor instance, plugin should take this chance to save the
     * editor reference so that it can call to any editor method or format API later.
     * @param editor The editor object
     */
    initialize(editor: IEditor) {
        this.editor = editor;
    }

    /**
     * The last method that editor will call to a plugin before it is disposed.
     * Plugin can take this chance to clear the reference to editor. After this method is
     * called, plugin should not call to any editor method since it will result in error.
     */
    dispose() {
        this.editor = null;
    }

    /**
     * Core method for a plugin. Once an event happens in editor, editor will call this
     * method of each plugin to handle the event as long as the event is not handled
     * exclusively by another plugin.
     * @param event The event to handle:
     */
    onPluginEvent(event: PluginEvent) {
        switch (event.eventType) {
            case PluginEventType.EditorReady:
            case PluginEventType.ContentChanged:
                this.normalizeTables(this.editor.queryElements('table'));
                this.normalizeBlockquotes(this.editor.queryElements('blockquote'));
                break;

            case PluginEventType.BeforePaste:
                this.normalizeTables(toArray(event.fragment.querySelectorAll('table')));
                break;

            case PluginEventType.MouseDown:
                this.normalizeTableFromEvent(event.rawEvent);
                break;

            case PluginEventType.KeyDown:
                if (event.rawEvent.shiftKey) {
                    this.normalizeTableFromEvent(event.rawEvent);
                }
                break;

            case PluginEventType.ExtractContentWithDom:
                if (this.editor.isFeatureEnabled(ExperimentalFeatures.NormalizeList)) {
                    normalizeListsForExport(event.clonedRoot);
                }
                break;
        }
    }

    private normalizeTableFromEvent(event: KeyboardEvent | MouseEvent) {
        const table = this.editor.getElementAtCursor(
            'table',
            event.target as Node
        ) as HTMLTableElement;

        if (table) {
            this.normalizeTables([table]);
        }
    }

    private normalizeTables(tables: HTMLTableElement[]) {
        if (tables.length > 0) {
            const rangeEx = this.editor.getSelectionRangeEx();
            const { startContainer, endContainer, startOffset, endOffset } =
                (rangeEx?.type == SelectionRangeTypes.Normal && rangeEx.ranges[0]) || {};

            const isChanged = normalizeTables(tables);

            if (isChanged) {
                if (startContainer && endContainer) {
                    this.editor.select(startContainer, startOffset, endContainer, endOffset);
                } else if (rangeEx?.type == SelectionRangeTypes.TableSelection) {
                    this.editor.select(rangeEx.table, rangeEx.coordinates);
                }
            }
        }
    }

    private normalizeBlockquotes(elements: HTMLQuoteElement[]) {
        elements.forEach((quote: HTMLQuoteElement) => {
            const centeredElement = quote.querySelector('[style^="text-align: center"]');

            if (centeredElement) {
                if (isRTL(centeredElement)) {
                    delete quote.style.marginInlineEnd;
                    quote.style.marginInlineStart = 'auto';
                } else {
                    delete quote.style.marginInlineStart;
                    quote.style.marginInlineEnd = 'auto';
                }
            } else {
                delete quote.style.marginInlineStart;
                delete quote.style.marginInlineEnd;
            }
        });
    }
}

function isRTL(centeredElement: Element) {
    return (
        getComputedStyle(centeredElement, 'direction') == 'rtl' ||
        centeredElement.getAttribute('dir') == 'rtl'
    );
}

function normalizeTables(tables: HTMLTableElement[]) {
    let isDOMChanged = false;
    tables.forEach(table => {
        let tbody: HTMLTableSectionElement | null = null;

        for (let child = table.firstChild; child; child = child.nextSibling) {
            const tag = getTagOfNode(child);
            switch (tag) {
                case 'TR':
                    if (!tbody) {
                        tbody = table.ownerDocument.createElement('tbody');
                        table.insertBefore(tbody, child);
                    }

                    tbody.appendChild(child);
                    child = tbody;
                    isDOMChanged = true;

                    break;
                case 'TBODY':
                    if (tbody) {
                        moveChildNodes(tbody, child, true /*keepExistingChildren*/);
                        child.parentNode?.removeChild(child);
                        child = tbody;
                        isDOMChanged = true;
                    } else {
                        tbody = child as HTMLTableSectionElement;
                    }
                    break;
                default:
                    tbody = null;
                    break;
            }
        }

        const colgroups = table.querySelectorAll('colgroup');
        const thead = table.querySelector('thead');
        if (thead) {
            colgroups.forEach(colgroup => {
                if (!thead.contains(colgroup)) {
                    thead.appendChild(colgroup);
                }
            });
        }
    });

    return isDOMChanged;
}

function normalizeListsForExport(root: ParentNode) {
    toArray(root.querySelectorAll('li')).forEach(li => {
        const prevElement = li.previousSibling;

        if (li.style.display == 'block' && safeInstanceOf(prevElement, 'HTMLLIElement')) {
            delete li.style.display;

            prevElement.appendChild(changeElementTag(li, 'div'));
        }
    });
}
