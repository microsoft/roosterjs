import DefaultFormat from '../editor/DefaultFormat';

interface ClipboardData {
    snapshotBeforePaste: string;
    originalFormat: DefaultFormat;
    currentStyles: {[name: string]: string};
    image: File;
    text: string;
    html: string;
    isHtmlFromTempDiv?: boolean;
}

export default ClipboardData;
