import { isNodeOfType, normalizeRect } from 'roosterjs-content-model-dom';
import { TableEditor } from './editors/TableEditor';
import type { TableWithRoot } from './TableWithRoot';
import type { TableEditFeatureName } from './editors/features/TableEditFeatureName';
import type { OnTableEditorCreatedCallback } from './OnTableEditorCreatedCallback';
import type {
    DOMHelper,
    EditorPlugin,
    IEditor,
    PluginEvent,
    Rect,
} from 'roosterjs-content-model-types';

const TABLE_RESIZER_LENGTH = 12;

/**
 * TableEdit plugin, provides the ability to resize a table by drag-and-drop
 */
export class TableEditPlugin implements EditorPlugin {
    private editor: IEditor | null = null;
    private onMouseMoveDisposer: (() => void) | null = null;
    private tableRectMap: (TableWithRoot & { rect: Rect })[] | null = null;
    private tableEditor: TableEditor | null = null;

    /**
     * Construct a new instance of TableResize plugin
     * @param anchorContainerSelector An optional selector string to specify the container to host the plugin.
     * The container must not be affected by transform: scale(), otherwise the position calculation will be wrong.
     * If not specified, the plugin will be inserted in document.body
     * @param onTableEditorCreated An optional callback to customize the Table Editors elements when created.
     * @param disableFeatures An optional array of TableEditFeatures to disable
     * @param tableSelector A function to select the tables to be edited. By default, it selects all contentEditable tables.
     */
    constructor(
        private anchorContainerSelector?: string,
        private onTableEditorCreated?: OnTableEditorCreatedCallback,
        private disableFeatures?: TableEditFeatureName[],
        private tableSelector: (domHelper: DOMHelper) => TableWithRoot[] = defaultTableSelector
    ) {}

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
    initialize(editor: IEditor) {
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
        this.onTableEditorCreated = undefined;
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
        let currentTable: TableWithRoot | null = null;

        //Find table in range of mouse
        if (this.tableRectMap) {
            for (let i = this.tableRectMap.length - 1; i >= 0; i--) {
                const entry = this.tableRectMap[i];
                const { rect } = entry;

                if (
                    x >= rect.left - TABLE_RESIZER_LENGTH &&
                    x <= rect.right + TABLE_RESIZER_LENGTH &&
                    y >= rect.top - TABLE_RESIZER_LENGTH &&
                    y <= rect.bottom + TABLE_RESIZER_LENGTH
                ) {
                    currentTable = entry;
                    break;
                }
            }
        }

        this.setTableEditor(currentTable, e);
        this.tableEditor?.onMouseMove(x, y);
    };

    /**
     * @internal Public only for unit test
     * @param entry Table to use when setting the Editors
     * @param event (Optional) Mouse event
     */
    public setTableEditor(entry: TableWithRoot | null, event?: MouseEvent) {
        if (
            this.tableEditor &&
            !this.tableEditor.isEditing() &&
            entry?.table != this.tableEditor.table
        ) {
            this.disposeTableEditor();
        }

        if (!this.tableEditor && entry && this.editor && entry.table.rows.length > 0) {
            // anchorContainerSelector is used to specify the container to host the plugin, which can be outside of the editor's div
            const container = this.anchorContainerSelector
                ? this.editor.getDocument().querySelector(this.anchorContainerSelector)
                : undefined;

            this.tableEditor = new TableEditor(
                this.editor,
                entry.table,
                entry.logicalRoot,
                this.invalidateTableRects,
                isNodeOfType(container, 'ELEMENT_NODE') ? container : undefined,
                event?.currentTarget,
                this.onTableEditorCreated,
                this.disableFeatures
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

            const tables = this.tableSelector(this.editor.getDOMHelper());
            tables.forEach(table => {
                const rect = normalizeRect(table.table.getBoundingClientRect());

                if (rect && this.tableRectMap) {
                    this.tableRectMap.push({
                        ...table,
                        rect,
                    });
                }
            });
        }
    }
}

function defaultTableSelector(domHelper: DOMHelper): TableWithRoot[] {
    return domHelper
        .queryElements('table')
        .filter(table => table.isContentEditable)
        .map(table => ({
            table,
            logicalRoot: null,
        }));
}
