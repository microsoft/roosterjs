/**
 * Handles the content when using the Image Paste Option
 * @param imageDataUri the image uri to use for the image
 * @param fragment fragment that will contain the content to paste.
 */
export default function handleImagePaste(imageDataUri: string, fragment: DocumentFragment) {
    const img = fragment.ownerDocument.createElement('img');
    img.style.maxWidth = '100%';
    img.src = imageDataUri;
    fragment.appendChild(img);
}
