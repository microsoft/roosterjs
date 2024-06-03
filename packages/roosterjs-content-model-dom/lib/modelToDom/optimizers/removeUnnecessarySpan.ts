import { isNodeOfType } from '../../domUtils/isNodeOfType';

/**
 * @internal
 */
export function removeUnnecessaryAttribute(root: Node, computedAttributes: Record<string, Attr>) {
    if (!isNodeOfType(root, 'ELEMENT_NODE')) {
        return
    }
    let newComputedAttributes = {
        ...computedAttributes,
    };
    for (let i = root.attributes.length - 1; i >= 0; i--) {
        const attr = root.attributes[i];
        if (newComputedAttributes[attr.name]?.isEqualNode(attr) ?? false) {
            root.removeAttribute(attr.name);
        } else {
            newComputedAttributes[attr.name] = attr;
        }
    }

    for (let child = root.firstChild; child; child = child.nextSibling) {
        removeUnnecessaryAttribute(child, newComputedAttributes);
    }
}

/**
 * @internal
 */
export function enumerateComputedStyle(element: HTMLElement, handler: (key: string, value: Set<string>) => void) {
    element.style.cssText.split(";").forEach((value) => {
        let [key, valueText] = value.split(":");
        if (!key || !valueText) {
            return;
        }
        key = key.trim();
        let values = new Set(valueText.split(",").map((value) => value.trim()));

        handler(key, values);
    });
}

/**
 * @internal
 */
export function removeUnnecessaryStyle(root: Node, computedCSS: Record<string, Set<string>>) {
    if (!isNodeOfType(root, 'ELEMENT_NODE')) {
        return
    }
    let newComputedCSS = {
        ...computedCSS
    }
    enumerateComputedStyle(root, (key, values) => {
        if (computedCSS[key]?.size === values.size && [...computedCSS[key]].every((value) => values.has(value))) {
            root.style.removeProperty(key);
        } else {
            newComputedCSS[key] = values;
        }
    });

    if (root.style.cssText === "") {
        root.removeAttribute("style");
    }

    for (let child = root.firstChild; child; child = child.nextSibling) {
        removeUnnecessaryStyle(child, newComputedCSS);
    }
}

/**
 * @internal
 */
export function removeUnnecessarySpan(root: Node) {
    for (let child = root.firstChild; child; ) {
        if (
            isNodeOfType(child, 'ELEMENT_NODE') &&
            child.tagName == 'SPAN' &&
            child.attributes.length == 0 &&
            !isImageSpan(child)
        ) {
            const node = child;
            let refNode = child.nextSibling;
            child = child.nextSibling;

            while (node.lastChild) {
                const newNode = node.lastChild;
                root.insertBefore(newNode, refNode);
                refNode = newNode;
            }

            root.removeChild(node);
        } else {
            child = child.nextSibling;
        }
    }
}

const isImageSpan = (child: HTMLElement) => {
    return (
        isNodeOfType(child.firstChild, 'ELEMENT_NODE') &&
        child.firstChild.tagName == 'IMG' &&
        child.firstChild == child.lastChild
    );
};
