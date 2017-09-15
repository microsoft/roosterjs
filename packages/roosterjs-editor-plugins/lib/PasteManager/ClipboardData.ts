export interface LocalFileImageData {
    path: string;
    imageId: string;
}

export interface Base64ImageData {
    base64Content: string;
    mimeType: string;
    imageId: string;
}

export interface ImageData {
    file?: File; // images pasted as File in DataTransfer, e.g. from snipping tool, file explorer, etc.
    localFileImages?: LocalFileImageData[]; // images pasted with src as file:///C:/Users/... e.g. from Word, OneNote, etc.
    base64Images?: Base64ImageData[]; // images pasted with src as data uri
    noSrcImageIds?: string[]; // images pasted with no src
}

interface ClipboardData {
    imageData: ImageData;
    htmlData: string;
}

export default ClipboardData;
