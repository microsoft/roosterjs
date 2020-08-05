import UndoPluginState from './UndoPluginState';

/**
 * @internal
 * Whether there is a snapshot for undo
 */
export default function canUndo(state: UndoPluginState): boolean {
    return state.hasNewContent || state.snapshotsService.canMove(-1 /*previousSnapshot*/);
}
