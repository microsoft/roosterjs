import { getHTMLImageOptions } from '../../../lib/imageEdit/utils/getHTMLImageOptions';
import { IEditor, ImageMetadataFormat } from 'roosterjs-content-model-types';
import { ImageEditOptions } from '../../../lib/imageEdit/types/ImageEditOptions';
import { ImageHtmlOptions } from '../../../lib/imageEdit/types/ImageHtmlOptions';

describe('getHTMLImageOptions', () => {
    const createEditor = (darkMode: boolean) => {
        return { isDarkMode: () => darkMode } as IEditor;
    };

    function runTest(
        darkMode: boolean,
        options: ImageEditOptions,
        editInfo: ImageMetadataFormat,
        expectResult: ImageHtmlOptions
    ) {
        const editor = createEditor(darkMode);
        const result = getHTMLImageOptions(editor, options, editInfo);
        expect(result).toEqual(expectResult);
    }

    it('Light mode and not small', () => {
        runTest(
            false,
            {
                borderColor: '#DB626C',
                minWidth: 10,
                minHeight: 10,
                preserveRatio: true,
                disableRotate: false,
                disableSideResize: false,
                onSelectState: 'resize',
            },
            {
                src: 'test',
                widthPx: 200,
                heightPx: 200,
                naturalWidth: 10,
                naturalHeight: 10,
                leftPercent: 0,
                rightPercent: 0,
                topPercent: 0.1,
                bottomPercent: 0,
                angleRad: 0,
            },
            {
                borderColor: '#DB626C',
                rotateHandleBackColor: 'white',
                isSmallImage: false,
            }
        );
    });

    it('Light mode and not small', () => {
        runTest(
            true,
            {
                borderColor: '#DB626C',
                minWidth: 10,
                minHeight: 10,
                preserveRatio: true,
                disableRotate: false,
                disableSideResize: false,
                onSelectState: 'resize',
            },
            {
                src: 'test',
                widthPx: 10,
                heightPx: 10,
                naturalWidth: 10,
                naturalHeight: 10,
                leftPercent: 0,
                rightPercent: 0,
                topPercent: 0.1,
                bottomPercent: 0,
                angleRad: 0,
            },
            {
                borderColor: '#DB626C',
                rotateHandleBackColor: '#333',
                isSmallImage: true,
            }
        );
    });
});
