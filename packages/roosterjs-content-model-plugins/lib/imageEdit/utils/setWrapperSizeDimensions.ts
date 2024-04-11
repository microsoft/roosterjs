import { getPx } from './getPx';

export function setWrapperSizeDimensions(
    wrapper: HTMLElement,
    image: HTMLImageElement,
    width: number,
    height: number
) {
    const hasBorder = image.style.borderStyle;
    if (hasBorder) {
        const borderWidth = image.style.borderWidth ? 2 * parseInt(image.style.borderWidth) : 2;
        wrapper.style.width = getPx(width + borderWidth);
        wrapper.style.height = getPx(height + borderWidth);
        return;
    }
    wrapper.style.width = getPx(width);
    wrapper.style.height = getPx(height);
}
