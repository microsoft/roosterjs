import { ListType } from 'roosterjs-editor-types';

function isABulletList(trigger: string) {
    const triggerLength = trigger.length;
    if (triggerLength === 1) {
        const REGEX: RegExp = /^((.*?)-|^(.*?)*|^(.*?)>)$/;
        return REGEX.test(trigger);
    } else if (triggerLength === 2) {
        const REGEX: RegExp = /^((.*?)=>|^(.*?)->|^(.*?)=>|^(.*?)--)$/;
        return REGEX.test(trigger);
    } else if (triggerLength === 3) {
        const REGEX: RegExp = /^(.*?)-->$/;
        return REGEX.test(trigger);
    }
    return false;
}

function isANumberingList(trigger: string) {
    const triggerLength = trigger.length;
    if (triggerLength === 2) {
        const REGEX: RegExp = /^([1-9,a-z,A-Z]{1,2}\.|[1-9,a-z,A-Z]{1,2}\)|[1-9,a-z,A-Z]{1,2}\-)$/;
        return REGEX.test(trigger);
    } else if (triggerLength === 3) {
        const REGEX: RegExp = /^(\([1-9,a-z, A-Z]{1,2}\))$/;
        return REGEX.test(trigger);
    }
    return false;
}

/**
 * @internal
 * @param textBeforeCursor The trigger character
 * @returns If the list is ordered or unordered
 */
export default function getListType(textBeforeCursor: string): ListType {
    const trigger = textBeforeCursor.replace(/\s/g, '');
    if (isABulletList(trigger)) {
        return ListType.Unordered;
    } else if (isANumberingList(trigger)) {
        return ListType.Ordered;
    } else {
        return ListType.None;
    }
}
