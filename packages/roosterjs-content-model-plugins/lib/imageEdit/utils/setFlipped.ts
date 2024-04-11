export function setFlipped(
    element: HTMLElement | null,
    flippedHorizontally?: boolean,
    flippedVertically?: boolean
) {
    if (element) {
        element.style.transform = `scale(${flippedHorizontally ? -1 : 1}, ${
            flippedVertically ? -1 : 1
        })`;
    }
}
