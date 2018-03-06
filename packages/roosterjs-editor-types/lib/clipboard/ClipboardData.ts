import DefaultFormat from '../editor/DefaultFormat';

interface ClipboardData {
    snapshotBeforePaste: string;
    originalFormat: DefaultFormat;
    image: File;
    text: string;
    html: string;
    isHtmlFromTempDiv?: boolean;
}

export default ClipboardData;
