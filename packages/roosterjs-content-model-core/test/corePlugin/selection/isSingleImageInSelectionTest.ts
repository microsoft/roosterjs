import { isSingleImageInSelection } from '../../../lib/corePlugin/selection/isSingleImageInSelection';

describe('isSingleImageInSelection |', () => {
    describe('With selection', () => {
        it('Is not single image in Selection: Selection offsets substraction is not equal to 0', () => {
            const focusNode: any = {};
            const selection: any = <Partial<Selection>>{
                focusNode,
                anchorNode: focusNode,
                focusOffset: 0,
                anchorOffset: 2,
                getRangeAt: () => <any>{},
            };

            const result = isSingleImageInSelection(selection);

            expect(result).toBeNull();
        });

        it('Is not single image in Selection: Containers are not the same', () => {
            const focusNode: any = {};
            const anchorNode: any = { test: '' };
            const selection: any = <Partial<Selection>>{
                focusNode,
                anchorNode,
                focusOffset: 0,
                anchorOffset: 1,
                getRangeAt: () => <any>{},
            };

            const result = isSingleImageInSelection(selection);

            expect(result).toBeNull();
        });

        it('Is not single image in Selection: Element is not image', () => {
            const mockedElement = document.createElement('div');
            const focusNode: any = <Partial<Node>>{
                childNodes: <any>{
                    item: () => mockedElement,
                },
            };
            const selection: any = <Partial<Selection>>{
                focusNode,
                anchorNode: focusNode,
                focusOffset: 0,
                anchorOffset: 1,
                getRangeAt: () => <any>{},
            };

            const result = isSingleImageInSelection(selection);

            expect(result).toBeNull();
        });

        it('Is single image in selection', () => {
            const mockedElement = document.createElement('img');
            const focusNode: any = <Partial<Node>>{
                childNodes: <any>{
                    item: () => mockedElement,
                },
            };
            const selection: any = <Partial<Selection>>{
                focusNode,
                anchorNode: focusNode,
                focusOffset: 0,
                anchorOffset: 1,
                getRangeAt: () => <any>{},
            };

            const result = isSingleImageInSelection(selection);

            expect(result).toBe(mockedElement);
        });
    });

    describe('With Range', () => {
        it('Is not single image in Selection: Selection offsets substraction is not equal to 0', () => {
            const endContainer: any = {};
            const selection: any = <Partial<Range>>{
                endContainer,
                startContainer: endContainer,
                endOffset: 0,
                startOffset: 2,
            };

            const result = isSingleImageInSelection(selection);

            expect(result).toBeNull();
        });

        it('Is not single image in Selection: Containers are not the same', () => {
            const endContainer: any = {};
            const startContainer: any = { test: '' };
            const selection: any = <Partial<Range>>{
                endContainer,
                startContainer,
                endOffset: 0,
                startOffset: 1,
            };

            const result = isSingleImageInSelection(selection);

            expect(result).toBeNull();
        });

        it('Is not single image in Selection: Element is not image', () => {
            const mockedElement = document.createElement('div');
            const endContainer: any = <Partial<Node>>{
                childNodes: <any>{
                    item: () => mockedElement,
                },
            };
            const selection: any = <Partial<Range>>{
                endContainer,
                startContainer: endContainer,
                endOffset: 0,
                startOffset: 1,
            };

            const result = isSingleImageInSelection(selection);

            expect(result).toBeNull();
        });

        it('Is single image in selection', () => {
            const mockedElement = document.createElement('img');
            const endContainer: any = <Partial<Node>>{
                childNodes: <any>{
                    item: () => mockedElement,
                },
            };
            const selection: any = <Partial<Range>>{
                endContainer,
                startContainer: endContainer,
                endOffset: 0,
                startOffset: 1,
            };

            const result = isSingleImageInSelection(selection);

            expect(result).toBe(mockedElement);
        });
    });
});
