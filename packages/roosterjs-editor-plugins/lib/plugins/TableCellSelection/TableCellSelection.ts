import { clearState } from './utils/clearState';
import { DeleteTableContents } from './features/DeleteTableContents';
import { handleKeyDownEvent } from './keyUtils/handleKeyDownEvent';
import { handleKeyUpEvent } from './keyUtils/handleKeyUpEvent';
import { handleMouseDownEvent } from './mouseUtils/handleMouseDownEvent';
import { handleScrollEvent } from './mouseUtils/handleScrollEvent';
import { TableCellSelectionState } from './TableCellSelectionState';
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
    private editor: IEditor | null = null;
    private state: TableCellSelectionState | null;
    private shadowEditCoordinatesBackup: TableSelection | null = null;

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
        this.state = null;
        this.editor = null;
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(event: PluginEvent) {
        if (this.editor && this.state) {
            switch (event.eventType) {
                case PluginEventType.EnteredShadowEdit:
                    this.handleEnteredShadowEdit(this.state, this.editor);
                    break;
                case PluginEventType.LeavingShadowEdit:
                    this.handleLeavingShadowEdit(this.state, this.editor);
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
                        handleScrollEvent(this.state, this.editor);
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

    private handleLeavingShadowEdit(state: TableCellSelectionState, editor: IEditor) {
        if (state.firstTable && state.tableSelection && state.firstTable) {
            const table = editor.queryElements('#' + state.firstTable.id);
            if (table.length == 1) {
                state.firstTable = table[0] as HTMLTableElement;
                editor.select(state.firstTable, this.shadowEditCoordinatesBackup);
                this.shadowEditCoordinatesBackup = null;
            }
        }
    }

    private handleEnteredShadowEdit(state: TableCellSelectionState, editor: IEditor) {
        const selection = editor.getSelectionRangeEx();
        if (selection.type == SelectionRangeTypes.TableSelection) {
            this.shadowEditCoordinatesBackup = selection.coordinates ?? null;
            state.firstTable = selection.table;
            state.tableSelection = true;
            editor.select(selection.table, null);
        }
    }
}
