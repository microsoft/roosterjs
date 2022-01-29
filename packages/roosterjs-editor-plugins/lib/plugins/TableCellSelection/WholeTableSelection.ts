import TableSelector from './tableSelector/tableSelector';
import { EditorPlugin, IEditor, PluginEvent, PluginEventType, Rect } from 'roosterjs-editor-types';
import { normalizeRect } from 'roosterjs-editor-dom';

const TABLE_RESIZER_LENGTH = 12;

/**
 * WholeTableSelection plugin, provides the ability to select the whole table
 */
export default class WholeTableSelection implements EditorPlugin {
    private editor: IEditor;
    private onMouseMoveDisposer: () => void;
    private tableRectMap: { table: HTMLTableElement; rect: Rect }[] = null;
    private tableEditor: TableSelector;

    /**
     * Get a friendly name of  this plugin
     */
    getName() {
        return 'WholeTableSelection';
    }

    /**
     * Initialize this plugin. This should only be called from Editor
     * @param editor Editor instance
     */
    initialize(editor: IEditor) {
        this.editor = editor;
        this.onMouseMoveDisposer = this.editor.addDomEventHandler({
            mousemove: this.onMouseMoveTableSelector,
        });
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        this.onMouseMoveDisposer();
        this.invalidateTableRects();
        this.setTableEditor(null);
        this.editor = null;
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(e: PluginEvent) {
        switch (e.eventType) {
            case PluginEventType.Input:
            case PluginEventType.ContentChanged:
            case PluginEventType.Scroll:
                this.setTableEditor(null);
                this.invalidateTableRects();
                break;
        }
    }

    private onMouseMoveTableSelector = (e: MouseEvent) => {
        if (e.buttons > 0) {
            return;
        }

        this.ensureTableRects();
        const { pageX: x, pageY: y } = e;
        let currentTable: HTMLTableElement | null = null;

        for (let i = this.tableRectMap.length - 1; i >= 0; i--) {
            const { table, rect } = this.tableRectMap[i];

            if (
                x >= rect.left - TABLE_RESIZER_LENGTH &&
                x <= rect.right + TABLE_RESIZER_LENGTH &&
                y >= rect.top - TABLE_RESIZER_LENGTH &&
                y <= rect.bottom + TABLE_RESIZER_LENGTH
            ) {
                currentTable = table;
                break;
            }
        }

        this.setTableEditor(currentTable);
    };

    private setTableEditor(table: HTMLTableElement) {
        if (this.tableEditor && table != this.tableEditor.table) {
            this.tableEditor.dispose();
            this.tableEditor = null;
        }

        if (!this.tableEditor && table) {
            this.tableEditor = new TableSelector(this.editor, table, this.invalidateTableRects);
        }
    }

    private invalidateTableRects = () => {
        this.tableRectMap = null;
    };

    private ensureTableRects() {
        if (!this.tableRectMap) {
            this.tableRectMap = [];
            this.editor.queryElements('table', table => {
                if (table.isContentEditable) {
                    const rect = normalizeRect(table.getBoundingClientRect());
                    if (rect) {
                        this.tableRectMap.push({
                            table,
                            rect,
                        });
                    }
                }
            });
        }
    }
}
