/**
 * @internal
 */
export function deleteSingleChar(text: string, isForward: boolean) {
    // In case of emoji that occupies multiple characters, we need to delete the whole emoji
    const array = [...text];
    let deleteLength = 0;

    for (
        let i = isForward ? 0 : array.length - 1,
            deleteState: 'notDeleted' | 'waiting' | 'done' = 'notDeleted';
        i >= 0 && i < array.length && deleteState != 'done';
        i += isForward ? 1 : -1
    ) {
        switch (array[i]) {
            case '\u200D': // ZERO WIDTH JOINER
            case '\u20E3': // COMBINING ENCLOSING KEYCAP
            case '\uFE0E': // VARIATION SELECTOR-15
            case '\uFE0F': // VARIATION SELECTOR-16
                deleteState = 'notDeleted';
                deleteLength++;
                break;

            default:
                if (deleteState == 'notDeleted') {
                    deleteState = 'waiting';
                    deleteLength++;
                } else if (deleteState == 'waiting') {
                    deleteState = 'done';
                }
                break;
        }
    }

    array.splice(isForward ? 0 : array.length - deleteLength, deleteLength);

    return array.join('');
}
