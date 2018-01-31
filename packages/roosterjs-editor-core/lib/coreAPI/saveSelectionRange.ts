import EditorCore from '../editor/EditorCore';
import getLiveSelectionRange from './getLiveSelectionRange';

export default function saveSelectionRange(core: EditorCore) {
    core.cachedSelectionRange = getLiveSelectionRange(core);
    core.cachedRange = core.cachedSelectionRange ? core.cachedSelectionRange.rawRange : null;
}
