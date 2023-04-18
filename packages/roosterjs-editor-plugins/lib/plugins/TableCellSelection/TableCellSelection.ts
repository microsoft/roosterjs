import { clearState } from './utils/clearState';
import { DeleteTableContents } from './features/DeleteTableContents';
import { getCellCoordinates } from './utils/getCellCoordinates';
import { handleKeyDownEvent } from './keyUtils/handleKeyDownEvent';
import { handleKeyUpEvent } from './keyUtils/handleKeyUpEvent';
import { handleMouseDownEvent } from './mouseUtils/handleMouseDownEvent';
import { restoreSelection } from './utils/restoreSelection';
import { selectTable } from './utils/selectTable';
import { setData } from './utils/setData';
import { TableCellSelectionState } from './TableCellSelectionState';
import { updateSelection } from './utils/updateSelection';
import {
    EditorPlugin,
    IEditor,
    PluginEvent,
    PluginEventType,
    SelectionRangeTypes,
    TableSelection,
} from 'roosterjs-editor-types';

/**
 * TableCellSelectionPlugin help highlight table cells
 */
export default class TableCellSelection implements EditorPlugin {
    private editor: IEditor;
    private state: TableCellSelectionState;
    private shadowEditCoordinatesBackup: TableSelection | null;

    constructor() {
        this.state = {
            firstTable: null,
            lastTarget: null,
            firstTarget: null,
            preventKeyUp: false,
            startedSelection: false,
            tableSelection: false,
            targetTable: null,
            vTable: null,
            mouseMoveDisposer: null,
        };
    }

    /**
     * Get a friendly name of  this plugin
     */
    getName() {
        return 'TableCellSelection';
    }

    /**
     * Initialize this plugin. This should only be called from Editor
     * @param editor Editor instance
     */
    initialize(editor: IEditor) {
        this.editor = editor;
        this.editor.addContentEditFeature(DeleteTableContents);
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        clearState(this.state, this.editor);
        this.editor = null;
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(event: PluginEvent) {
        if (this.editor) {
            switch (event.eventType) {
                case PluginEventType.EnteredShadowEdit:
                    this.handleEnteredShadowEdit();
                    break;
                case PluginEventType.LeavingShadowEdit:
                    this.handleLeavingShadowEdit();
                    break;
                case PluginEventType.MouseDown:
                    if (!this.state.startedSelection) {
                        handleMouseDownEvent(event, this.state, this.editor);
                    }
                    break;
                case PluginEventType.KeyDown:
                    if (!this.state.startedSelection) {
                        handleKeyDownEvent(event, this.state, this.editor);
                    } else {
                        event.rawEvent.preventDefault();
                    }
                    break;
                case PluginEventType.KeyUp:
                    if (!this.state.startedSelection) {
                        handleKeyUpEvent(event, this.state, this.editor);
                    } else {
                        event.rawEvent.preventDefault();
                    }
                    break;
                case PluginEventType.Scroll:
                    if (this.state.startedSelection) {
                        this.handleScrollEvent();
                    }
                    break;
                case PluginEventType.BeforeSetContent:
                    this.state.firstTable = null;
                    this.state.tableSelection = false;
                    this.editor.select(null);
                    break;
            }
        }
    }

    private handleLeavingShadowEdit() {
        if (this.state.firstTable && this.state.tableSelection) {
            const table = this.editor.queryElements('#' + this.state.firstTable.id);
            if (table.length == 1) {
                this.state.firstTable = table[0] as HTMLTableElement;
                this.editor.select(this.state.firstTable, this.shadowEditCoordinatesBackup);
                this.shadowEditCoordinatesBackup = null;
            }
        }
    }

    private handleEnteredShadowEdit() {
        const selection = this.editor.getSelectionRangeEx();
        if (selection.type == SelectionRangeTypes.TableSelection) {
            this.shadowEditCoordinatesBackup = selection.coordinates;
            this.state.firstTable = selection.table;
            this.state.tableSelection = true;
            this.editor.select(selection.table, null);
        }
    }

    /**
     * Handle Scroll Event and mantains the selection range,
     * Since when we scroll the cursor does not trigger the on Mouse Move event
     * The table selection gets removed.
     */
    private handleScrollEvent() {
        const eventTarget = this.editor.getElementAtCursor();
        setData(eventTarget, this.state, this.editor);
        if (this.state.firstTable == this.state.targetTable) {
            if (this.state.tableSelection) {
                this.state.vTable.selection.lastCell = getCellCoordinates(
                    this.state.vTable,
                    this.state.lastTarget
                );
                selectTable(this.editor, this.state);
                updateSelection(this.editor, this.state.firstTarget, 0);
            }
        } else if (this.state.tableSelection) {
            restoreSelection(this.state, this.editor);
        }
    }
}
