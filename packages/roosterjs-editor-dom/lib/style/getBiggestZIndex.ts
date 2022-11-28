export default function getBiggestZIndex(element: HTMLElement) {
    let zIndex = parseInt(element.style.zIndex);
    let parent = element;
    while (parent) {
        const child = parent.firstElementChild as HTMLElement;
        const childZIndex = parseInt(child?.style?.zIndex);
        if (child && childZIndex > zIndex) {
            zIndex = childZIndex;
        }
        parent = child;
    }
    return zIndex;
}
