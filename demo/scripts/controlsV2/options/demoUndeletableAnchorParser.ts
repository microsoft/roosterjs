import { FormatParser, UndeletableFormat } from 'roosterjs-content-model-types';

const DemoUndeletableName = 'DemoUndeletable';

export function undeletableLinkChecker(a: HTMLAnchorElement): boolean {
    return a.getAttribute('name') == DemoUndeletableName;
}

export const demoUndeletableAnchorParser: FormatParser<UndeletableFormat> = (format, element) => {
    if (undeletableLinkChecker(element as HTMLAnchorElement)) {
        format.undeletable = true;
    }
};
