import UndoPluginState from './UndoPluginState';

export default function addUndoSnapshot(state: UndoPluginState) {
    let snapshot = state.getContent();
    state.snapshotsService.addSnapshot(snapshot);
    state.hasNewContent = false;
    return snapshot;
}
