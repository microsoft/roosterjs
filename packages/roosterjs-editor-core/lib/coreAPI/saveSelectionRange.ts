import EditorCore from '../editor/EditorCore';
import getSelectionRange from './getSelectionRange';

export default function saveSelectionRange(core: EditorCore) {
    core.cachedSelectionRange = getSelectionRange(core, false /*tryGetFromCache*/);
}
