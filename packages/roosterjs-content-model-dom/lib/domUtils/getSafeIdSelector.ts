const StartsWithUnsupportedCharacter = /^[.|\-|_|\d]/;

/**
 * Returns a safe Id to use in Native APIs.
 * IDs that start with number or hyphen can throw errors if used.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id
 * @param id
 * @returns
 */
export function getSafeIdSelector(id: string) {
    if (!id) {
        return id;
    }

    if (id.match(StartsWithUnsupportedCharacter)) {
        return `[id="${id}"]`;
    } else {
        return `#${id}`;
    }
}
