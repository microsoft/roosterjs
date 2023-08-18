// kebabCase from https://github.com/joakimbeng/kebab-case.git
const KEBAB_REGEX = /[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g;

export function kebabCase(str: string) {
    return str.replace(KEBAB_REGEX, function (match: string) {
        return '-' + match.toLowerCase();
    });
}
