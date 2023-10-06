import TableEditor from './editors/TableEditor';
import { normalizeRect, safeInstanceOf } from 'roosterjs-editor-dom';
import { PluginEventType } from 'roosterjs-editor-types';
import type {
    CreateElementData,
    EditorPlugin,
    IEditor,
    PluginEvent,
    Rect,
} from 'roosterjs-editor-types';

const TABLE_RESIZER_LENGTH = 12;

/**
 * TableResize plugin, provides the ability to resize a table by drag-and-drop
 */
export default class TableResize implements EditorPlugin {
    private editor: IEditor | null = null;
    private onMouseMoveDisposer: (() => void) | null = null;
    private tableRectMap: { table: HTMLTableElement; rect: Rect }[] | null = null;
    private tableEditor: TableEditor | null = null;

    /**
     * Construct a new instance of TableResize plugin
     * @param onShowHelperElement An optional callback to allow customize helper element of table resizing.
     * To customize the helper element, add this callback and change the attributes of elementData then it
     * will be picked up by TableResize code
     * @param anchorContainerSelector An optional selector string to specify the container to host the plugin.
     * The container must not be affected by transform: scale(), otherwise the position calculation will be wrong.
     * If not specified, the plugin will be inserted in document.body
     */
    constructor(
        private onShowHelperElement?: (
            elementData: CreateElementData,
            helperType: 'CellResizer' | 'TableInserter' | 'TableResizer' | 'TableSelector'
        ) => void,
        private anchorContainerSelector?: string
    ) {}

    /**
     * Get a friendly name of  this plugin
     */
    getName() {
        return 'TableResize';
    }

    /**
     * Initialize this plugin. This should only be called from Editor
     * @param editor Editor instance
     */
    initialize(editor: IEditor) {
        this.editor = editor;
        this.onMouseMoveDisposer = this.editor.addDomEventHandler({
            mousemove: this.onMouseMove,
            mouseout: e => this.onMouseOut(e),
        });
    }

    private onMouseOut = (ev: Event) => {
        if (
            isMouseEvent(ev) &&
            safeInstanceOf(ev.relatedTarget, 'HTMLElement') &&
            this.tableEditor &&
            !this.tableEditor.isOwnedElement(ev.relatedTarget) &&
            !this.editor?.contains(ev.relatedTarget)
        ) {
            this.setTableEditor(null);
        }
    };

    /**
     * Dispose this plugin
     */
    dispose() {
        this.onMouseMoveDisposer?.();
        this.invalidateTableRects();
        this.disposeTableEditor();
        this.editor = null;
        this.onMouseMoveDisposer = null;
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
            case PluginEventType.ZoomChanged:
                this.setTableEditor(null);
                this.invalidateTableRects();
                break;
        }
    }

    private onMouseMove = (event: Event) => {
        const e = event as MouseEvent;

        if (e.buttons > 0 || !this.editor) {
            return;
        }

        this.ensureTableRects();

        const editorWindow = this.editor.getDocument().defaultView || window;
        const x = e.pageX - editorWindow.scrollX;
        const y = e.pageY - editorWindow.scrollY;
        let currentTable: HTMLTableElement | null = null;

        if (this.tableRectMap) {
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
        }

        this.setTableEditor(currentTable, e);
        this.tableEditor?.onMouseMove(x, y);
    };

    private setTableEditor(table: HTMLTableElement | null, e?: MouseEvent) {
        if (this.tableEditor && !this.tableEditor.isEditing() && table != this.tableEditor.table) {
            this.disposeTableEditor();
        }

        if (!this.tableEditor && table && this.editor && table.rows.length > 0) {
            const container = this.anchorContainerSelector
                ? this.editor.getDocument().querySelector(this.anchorContainerSelector)
                : undefined;

            this.tableEditor = new TableEditor(
                this.editor,
                table,
                this.invalidateTableRects,
                this.onShowHelperElement,
                safeInstanceOf(container, 'HTMLElement') ? container : undefined,
                e?.currentTarget
            );
        }
    }

    private invalidateTableRects = () => {
        this.tableRectMap = null;
    };

    private disposeTableEditor() {
        this.tableEditor?.dispose();
        this.tableEditor = null;
    }

    private ensureTableRects() {
        if (!this.tableRectMap && this.editor) {
            this.tableRectMap = [];
            this.editor.queryElements('table', table => {
                if (table.isContentEditable) {
                    const rect = normalizeRect(table.getBoundingClientRect());
                    if (rect && this.tableRectMap) {
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

function isMouseEvent(e: Event): e is MouseEvent {
    return !!(e as MouseEvent).pageX;
}
