export function loadImage(img: HTMLImageElement, src: string, callback: () => void) {
    img.onload = () => {
        img.onload = null;
        img.onerror = null;
        callback();
    };
    img.onerror = () => {
        img.onload = null;
        img.onerror = null;
        callback();
    };
    img.src = src;
}
