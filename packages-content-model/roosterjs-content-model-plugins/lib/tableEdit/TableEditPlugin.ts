import normalizeRect from '../pluginUtils/Rect/normalizeRect';
import TableEditor from './editors/TableEditor';
import { isNodeOfType } from 'roosterjs-content-model-dom/lib';
import type {
    EditorPlugin,
    IStandaloneEditor,
    PluginEvent,
    Rect,
} from 'roosterjs-content-model-types';

const TABLE_RESIZER_LENGTH = 12;

/**
 * TableEdit plugin, provides the ability to resize a table by drag-and-drop
 */
export class TableEditPlugin implements EditorPlugin {
    private editor: IStandaloneEditor | null = null;
    private onMouseMoveDisposer: (() => void) | null = null;
    private tableRectMap: { table: HTMLTableElement; rect: Rect }[] | null = null;
    private tableEditor: TableEditor | null = null;

    /**
     * Construct a new instance of TableResize plugin
     * @param anchorContainerSelector An optional selector string to specify the container to host the plugin.
     * The container must not be affected by transform: scale(), otherwise the position calculation will be wrong.
     * If not specified, the plugin will be inserted in document.body
     */
    constructor(private anchorContainerSelector?: string) {}

    /**
     * Get a friendly name of this plugin
     */
    getName() {
        return 'TableEdit';
    }

    /**
     * Initialize this plugin. This should only be called from Editor
     * @param editor Editor instance
     */
    initialize(editor: IStandaloneEditor) {
        this.editor = editor;
        this.onMouseMoveDisposer = this.editor.attachDomEvent({
            mousemove: { beforeDispatch: this.onMouseMove },
        });
        const scrollContainer = this.editor.getScrollContainer();
        scrollContainer.addEventListener('mouseout', this.onMouseOut);
    }

    private onMouseOut = ({ relatedTarget, currentTarget }: MouseEvent) => {
        const relatedTargetNode = relatedTarget as Node;
        const currentTargetNode = currentTarget as Node;
        if (
            isNodeOfType(relatedTargetNode, 'ELEMENT_NODE') &&
            isNodeOfType(currentTargetNode, 'ELEMENT_NODE') &&
            this.tableEditor &&
            !this.tableEditor.isOwnedElement(relatedTargetNode) &&
            !currentTargetNode.contains(relatedTargetNode)
        ) {
            this.setTableEditor(null);
        }
    };

    /**
     * Dispose this plugin
     */
    dispose() {
        const scrollContainer = this.editor?.getScrollContainer();
        scrollContainer?.removeEventListener('mouseout', this.onMouseOut);
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
            case 'input':
            case 'contentChanged':
            case 'scroll':
            case 'zoomChanged':
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

        //Fint table in range of mouse
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

    /**
     * @internal Public only for unit test
     * @param table Table to use when setting the Editors
     * @param event (Optional) Mouse event
     */
    public setTableEditor(table: HTMLTableElement | null, event?: MouseEvent) {
        if (this.tableEditor && !this.tableEditor.isEditing() && table != this.tableEditor.table) {
            this.disposeTableEditor();
        }

        if (!this.tableEditor && table && this.editor && table.rows.length > 0) {
            const container = this.anchorContainerSelector
                ? this.editor.getDOMHelper().queryElements(this.anchorContainerSelector)[0]
                : undefined;

            this.tableEditor = new TableEditor(
                this.editor,
                table,
                this.invalidateTableRects,
                isNodeOfType(container as Node, 'ELEMENT_NODE') ? container : undefined,
                event?.currentTarget
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

            const tables = this.editor.getDOMHelper().queryElements('table');
            tables.forEach(table => {
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
