/**
 * Read a file object and invoke a callback function with the data url of this file
 * @param file The file to read
 * @param callback the callback to invoke with data url of the file.
 * If fail to read, dataUrl will be null
 */
export default function readFile(file: Blob, callback: (dataUrl: string | null) => void) {
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            callback(reader.result as string);
        };
        reader.onerror = () => {
            callback(null);
        };
        reader.readAsDataURL(file);
    }
}
