export function setEntityElementClasses(
    wrapper: HTMLElement,
    type: string,
    isReadonly: boolean,
    id?: string
) {
    wrapper.className = `_Entity _EType_${type} ${id ? `_EId_${id} ` : ''}_EReadonly_${
        isReadonly ? '1' : '0'
    }`;

    if (isReadonly) {
        wrapper.contentEditable = 'false';
    }
}
