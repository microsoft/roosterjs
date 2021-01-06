import { Snapshots } from 'roosterjs-editor-types';

/**
 * Whether there is a snapshot added before auto complete and it can be undone now
 */
export default function canUndoAutoComplete(snapshots: Snapshots): boolean {
    return (
        snapshots.autoCompleteIndex >= 0 &&
        snapshots.currentIndex - snapshots.autoCompleteIndex == 1
    );
}
