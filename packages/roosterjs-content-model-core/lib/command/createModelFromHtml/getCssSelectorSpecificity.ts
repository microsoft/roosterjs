type Specificity = [number, number, number];

const IdentifierRegex = /^(?:\\[0-9a-f]{1,6}\s?|\\[^\r\n\f]|[-\w\u0080-\uFFFF])+/i;
const LegacyPseudoElements = ['before', 'after', 'first-line', 'first-letter'];

/**
 * @internal
 * Calculate selector specificity as ID, class/attribute/pseudo-class, and type counts.
 */
export function getCssSelectorSpecificity(selector: string): Specificity {
    const result: Specificity = [0, 0, 0];

    for (let index = 0; index < selector.length; ) {
        const char = selector[index];

        if (selector.substr(index, 2) == '/*') {
            index = skipComment(selector, index);
        } else if (char == '#' || char == '.') {
            result[char == '#' ? 0 : 1]++;
            index++;
            index += identifierLength(selector, index);
        } else if (char == '[') {
            result[1]++;
            index = closingBracket(selector, index) + 1;
        } else if (char == ':') {
            const isPseudoElement = selector[index + 1] == ':';
            index += isPseudoElement ? 2 : 1;
            const length = identifierLength(selector, index);
            const name = decodeIdentifier(selector.substr(index, length)).toLowerCase();
            index += length;

            const isFunctional = selector[index] == '(';
            const end = isFunctional ? closingBracket(selector, index) : index;
            const argument = isFunctional ? selector.substring(index + 1, end) : '';

            if (isPseudoElement || LegacyPseudoElements.indexOf(name) >= 0) {
                result[2]++;

                if (name == 'slotted') {
                    addSpecificity(result, selectorListSpecificity(argument));
                }
            } else if (name == 'is' || name == 'not' || name == 'has') {
                addSpecificity(result, selectorListSpecificity(argument));
            } else if (name != 'where') {
                result[1]++;

                if (name == 'nth-child' || name == 'nth-last-child') {
                    const ofSelector = argument.match(/\s+of\s+(.+)$/i)?.[1];

                    if (ofSelector) {
                        addSpecificity(result, selectorListSpecificity(ofSelector));
                    }
                } else if (name == 'host' || name == 'host-context') {
                    addSpecificity(result, selectorListSpecificity(argument));
                }
            }

            index = isFunctional ? end + 1 : index;
        } else {
            const length = identifierLength(selector, index);

            if (length || char == '*') {
                index += length || 1;
                let isUniversal = char == '*';

                // A namespace prefix is not a type selector.
                if (selector[index] == '|' && selector[index + 1] != '|') {
                    index++;
                    isUniversal = selector[index] == '*';
                    index += isUniversal ? 1 : identifierLength(selector, index);
                }

                if (!isUniversal) {
                    result[2]++;
                }
            } else {
                index++;
            }
        }
    }

    return result;
}

/**
 * @internal
 * Split selector lists without splitting escaped commas, attributes, or functional arguments.
 */
export function splitCssSelectorList(selectorText: string): string[] {
    const result: string[] = [];
    let start = 0;

    for (let index = 0; index < selectorText.length; index++) {
        const char = selectorText[index];

        if (selectorText.substr(index, 2) == '/*') {
            index = skipComment(selectorText, index) - 1;
        } else if (char == '\\') {
            index++;
        } else if (char == '(' || char == '[') {
            index = closingBracket(selectorText, index);
        } else if (char == ',') {
            result.push(selectorText.substring(start, index).trim());
            start = index + 1;
        }
    }

    result.push(selectorText.substring(start).trim());
    return result;
}

function selectorListSpecificity(selectorText: string): Specificity {
    return splitCssSelectorList(selectorText).reduce<Specificity>(
        (highest, selector) => {
            const current = getCssSelectorSpecificity(selector);
            const comparison =
                current[0] - highest[0] || current[1] - highest[1] || current[2] - highest[2];

            return comparison > 0 ? current : highest;
        },
        [0, 0, 0]
    );
}

function addSpecificity(target: Specificity, source: Specificity) {
    target[0] += source[0];
    target[1] += source[1];
    target[2] += source[2];
}

function identifierLength(text: string, index: number): number {
    return text.substring(index).match(IdentifierRegex)?.[0].length || 0;
}

function decodeIdentifier(identifier: string): string {
    return identifier.replace(
        /\\(?:([0-9a-f]{1,6})\s?|(.))/gi,
        (_match: string, hex: string, literal: string) => {
            if (!hex) {
                return literal;
            }

            const code = parseInt(hex, 16);
            return String.fromCodePoint(
                code == 0 || code > 0x10ffff || (code >= 0xd800 && code <= 0xdfff) ? 0xfffd : code
            );
        }
    );
}

function skipComment(text: string, start: number): number {
    const end = text.indexOf('*/', start + 2);
    return end < 0 ? text.length : end + 2;
}

function closingBracket(text: string, start: number): number {
    const stack = [text[start] == '(' ? ')' : ']'];
    let quote = '';

    for (let index = start + 1; index < text.length; index++) {
        const char = text[index];

        if (char == '\\') {
            index++;
        } else if (quote) {
            if (char == quote) {
                quote = '';
            }
        } else if (char == '"' || char == "'") {
            quote = char;
        } else if (text.substr(index, 2) == '/*') {
            index = skipComment(text, index) - 1;
        } else if (char == '(' || char == '[') {
            stack.push(char == '(' ? ')' : ']');
        } else if (char == stack[stack.length - 1]) {
            stack.pop();

            if (stack.length == 0) {
                return index;
            }
        }
    }

    return text.length;
}
