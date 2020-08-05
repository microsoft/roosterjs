import UndoPluginState from './UndoPluginState';

/**
 * @internal
 * Whether there is a snapshot for redo
 */
export default function canRedo(state: UndoPluginState): boolean {
    return state.snapshotsService.canMove(1 /*nextSnapshot*/);
}
