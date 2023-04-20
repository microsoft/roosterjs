import applyImageBorderFormat from '../../../lib/modelApi/image/applyImageBorderFormat';
import { Border } from '../../../lib/publicTypes/interface/Border';
import { ContentModelImage } from '../../../lib/publicTypes/segment/ContentModelImage';

describe('applyImageBorderFormat', () => {
    function createImage(border?: string): ContentModelImage {
        return {
            src: 'test',
            alt: 'test',
            title: 'test',
            isSelectedAsImageSelection: true,
            segmentType: 'Image',
            dataset: {},
            format: {
                borderTop: border,
                borderBottom: border,
                borderLeft: border,
                borderRight: border,
            },
        };
    }

    function runTest(
        format: Border | null,
        expectedBorder: string | undefined,
        previousBorder?: string
    ) {
        const image = createImage(previousBorder);
        applyImageBorderFormat(image, format, '5px');
        expect(image.format.borderBottom).toBe(expectedBorder);
        expect(image.format.borderRadius).toBe('5px');
    }

    it('apply only color to image without format', () => {
        runTest(
            {
                color: 'red',
            },
            '1px solid red'
        );
    });

    it('apply only width to image without format', () => {
        runTest(
            {
                width: '10px',
            },
            '10px solid'
        );
    });

    it('apply only width to image without format in points', () => {
        runTest(
            {
                width: '3/4pt',
            },
            '5.333px solid'
        );
    });

    it('apply only style to image without format', () => {
        runTest(
            {
                style: 'groove',
            },
            '1px groove'
        );
    });

    it('apply only color to image with format', () => {
        runTest(
            {
                color: 'red',
            },
            '10px groove red',
            '10px groove blue'
        );
    });

    it('apply only width to image with format', () => {
        runTest(
            {
                width: '20px',
            },
            '20px groove blue',
            '10px groove blue'
        );
    });

    it('apply only width to image with format in points', () => {
        runTest(
            {
                width: '3/4pt',
            },
            '5.333px groove blue',
            '10px groove blue'
        );
    });

    it('apply only style to image with format ', () => {
        runTest(
            {
                style: 'dotted',
            },
            '10px dotted blue',
            '10px groove blue'
        );
    });

    it('apply only style to image with format ', () => {
        runTest(
            {
                style: 'dotted',
            },
            '10px dotted blue',
            '10px groove blue'
        );
    });

    it('apply color and style to image with format ', () => {
        runTest(
            {
                color: 'red',
                style: 'dotted',
            },
            '10px dotted red',
            '10px groove blue'
        );
    });

    it('apply color, style, width to image with format ', () => {
        runTest(
            {
                color: 'red',
                style: 'dotted',
                width: '20px',
            },
            '20px dotted red',
            '10px groove blue'
        );
    });

    it('apply color and width to image without format ', () => {
        runTest(
            {
                color: 'red',
                width: '20px',
            },
            '20px solid red'
        );
    });

    it('apply width and style to image without format ', () => {
        runTest(
            {
                style: 'dotted',
                width: '20px',
            },
            '20px dotted'
        );
    });

    it('remove border', () => {
        runTest(null /* remove format */, undefined /* no expected border */, '10px groove blue');
    });
});
