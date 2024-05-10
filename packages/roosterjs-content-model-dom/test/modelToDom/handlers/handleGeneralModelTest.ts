import * as applyFormat from '../../../lib/modelToDom/utils/applyFormat';
import * as stackFormat from '../../../lib/modelToDom/utils/stackFormat';
import { createGeneralBlock } from '../../../lib/modelApi/creators/createGeneralBlock';
import { createGeneralSegment } from '../../../lib/modelApi/creators/createGeneralSegment';
import { createLinkDecorator } from '../../../lib';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import {
    handleGeneralBlock,
    handleGeneralSegment,
} from '../../../lib/modelToDom/handlers/handleGeneralModel';
import {
    ModelToDomContext,
    ContentModelBlockHandler,
    ContentModelHandler,
    ReadonlyContentModelBlockGroup,
    ReadonlyContentModelListItem,
    ReadonlyContentModelFormatContainer,
} from 'roosterjs-content-model-types';

describe('handleBlockGroup', () => {
    let context: ModelToDomContext;
    let parent: HTMLDivElement;
    let handleBlockGroupChildren: jasmine.Spy<ContentModelHandler<ReadonlyContentModelBlockGroup>>;
    let handleListItem: jasmine.Spy<ContentModelBlockHandler<ReadonlyContentModelListItem>>;
    let handleQuote: jasmine.Spy<ContentModelBlockHandler<ReadonlyContentModelFormatContainer>>;

    beforeEach(() => {
        handleBlockGroupChildren = jasmine.createSpy('handleBlockGroupChildren');
        handleListItem = jasmine.createSpy('handleListItem');
        handleQuote = jasmine.createSpy('handleQuote');

        context = createModelToDomContext(undefined, {
            modelHandlerOverride: {
                blockGroupChildren: handleBlockGroupChildren,
                listItem: handleListItem,
                formatContainer: handleQuote,
            },
        });
        parent = document.createElement('div');
    });

    it('General block', () => {
        const childMock = document.createElement('span');
        const group = createGeneralBlock(childMock);

        spyOn(applyFormat, 'applyFormat');

        handleGeneralBlock(document, parent, group, context, null);

        expect(parent.outerHTML).toBe('<div><span></span></div>');
        expect(typeof parent.firstChild).toBe('object');
        expect(parent.firstChild).toBe(childMock);
        expect(context.listFormat.nodeStack).toEqual([]);
        expect(handleBlockGroupChildren).toHaveBeenCalledTimes(1);
        expect(handleBlockGroupChildren).toHaveBeenCalledWith(document, childMock, group, context);
        expect(applyFormat.applyFormat).toHaveBeenCalledTimes(1);
    });

    it('General block with color', () => {
        const child = document.createElement('span');
        const group = createGeneralBlock(child);

        group.format.textColor = 'red';
        group.format.backgroundColor = 'green';

        handleGeneralBlock(document, parent, group, context, null);

        expect(parent.outerHTML).toBe(
            '<div><span style="color: red; background-color: green;"></span></div>'
        );
    });

    it('General segment: empty element', () => {
        const childMock = document.createElement('span');
        const group = createGeneralSegment(childMock);

        spyOn(applyFormat, 'applyFormat');

        handleGeneralSegment(document, parent, group, context, []);

        expect(parent.outerHTML).toBe('<div><span><span></span></span></div>');
        expect(context.regularSelection.current.segment).toBe(childMock);
        expect(typeof parent.firstChild).toBe('object');
        expect(parent.firstChild?.firstChild).toBe(childMock);
        expect(context.listFormat.nodeStack).toEqual([]);
        expect(handleBlockGroupChildren).toHaveBeenCalledTimes(1);
        expect(handleBlockGroupChildren).toHaveBeenCalledWith(document, childMock, group, context);
        expect(applyFormat.applyFormat).toHaveBeenCalled();
    });

    it('General segment: element with color', () => {
        const child = document.createElement('span');
        const group = createGeneralSegment(child);

        group.format.textColor = 'red';
        group.format.textColor = 'green';

        handleGeneralSegment(document, parent, group, context, []);

        expect(parent.outerHTML).toBe(
            '<div><span style="color: green;"><span style="color: green;"></span></span></div>'
        );
    });

    it('General segment: element with child', () => {
        const childMock = document.createElement('span');
        const group = createGeneralSegment(childMock);

        spyOn(applyFormat, 'applyFormat');

        handleGeneralSegment(document, parent, group, context, []);

        expect(parent.outerHTML).toBe('<div><span><span></span></span></div>');
        expect(context.regularSelection.current.segment).toBe(childMock);
        expect(typeof parent.firstChild).toBe('object');
        expect(parent.firstChild?.firstChild).toBe(childMock);
        expect(context.listFormat.nodeStack).toEqual([]);
        expect(handleBlockGroupChildren).toHaveBeenCalledTimes(1);
        expect(handleBlockGroupChildren).toHaveBeenCalledWith(document, childMock, group, context);
        expect(applyFormat.applyFormat).toHaveBeenCalled();
    });

    it('General segment: element with link', () => {
        const childMock = document.createElement('span');
        const group = createGeneralSegment(childMock);

        group.link = createLinkDecorator({
            href: '/test',
            underline: true,
        });

        spyOn(applyFormat, 'applyFormat').and.callThrough();

        handleGeneralSegment(document, parent, group, context, []);

        expect(parent.outerHTML).toBe('<div><span><a href="/test"><span></span></a></span></div>');
        expect(context.regularSelection.current.segment).toBe(childMock);
        expect(typeof parent.firstChild).toBe('object');
        expect(parent.firstChild?.firstChild).toBe(childMock.parentElement);
        expect(context.listFormat.nodeStack).toEqual([]);
        expect(handleBlockGroupChildren).toHaveBeenCalledTimes(1);
        expect(handleBlockGroupChildren).toHaveBeenCalledWith(document, childMock, group, context);
        expect(applyFormat.applyFormat).toHaveBeenCalled();
    });

    it('call stackFormat', () => {
        const childMock = document.createElement('span');
        const group = createGeneralSegment(childMock, { underline: true });

        group.link = createLinkDecorator({
            href: '/test',
        });

        spyOn(stackFormat, 'stackFormat').and.callThrough();

        handleGeneralSegment(document, parent, group, context, []);

        expect(stackFormat.stackFormat).toHaveBeenCalledTimes(1);
        expect((<jasmine.Spy>stackFormat.stackFormat).calls.argsFor(0)[1]).toBe('a');
    });

    it('General block with refNode', () => {
        const childMock = document.createElement('span');
        const group = createGeneralBlock(childMock);

        spyOn(applyFormat, 'applyFormat');

        const br = document.createElement('br');
        parent.appendChild(br);

        const result = handleGeneralBlock(document, parent, group, context, br);

        expect(parent.outerHTML).toBe('<div><span></span><br></div>');
        expect(typeof parent.firstChild).toBe('object');
        expect(parent.firstChild).toBe(childMock);
        expect(context.listFormat.nodeStack).toEqual([]);
        expect(handleBlockGroupChildren).toHaveBeenCalledTimes(1);
        expect(handleBlockGroupChildren).toHaveBeenCalledWith(document, childMock, group, context);
        expect(applyFormat.applyFormat).toHaveBeenCalledTimes(1);
        expect(result).toBe(br);
        expect(group.element).toBe(childMock);
    });

    it('General block with refNode, already in target node', () => {
        const node = document.createElement('span');
        const group = createGeneralBlock(node);
        const br = document.createElement('br');

        parent.appendChild(node);
        parent.appendChild(br);

        const result = handleGeneralBlock(document, parent, group, context, node);

        expect(parent.outerHTML).toBe('<div><span></span><br></div>');
        expect(parent.firstChild).toBe(node);
        expect(context.listFormat.nodeStack).toEqual([]);
        expect(handleBlockGroupChildren).toHaveBeenCalledTimes(1);
        expect(handleBlockGroupChildren).toHaveBeenCalledWith(document, node, group, context);
        expect(result).toBe(br);
        expect(group.element).toBe(node);
    });

    it('With onNodeCreated', () => {
        const parent = document.createElement('div');
        const node = document.createElement('span');
        const group = createGeneralBlock(node);

        const onNodeCreated = jasmine.createSpy('onNodeCreated');

        context.onNodeCreated = onNodeCreated;

        handleGeneralBlock(document, parent, group, context, null);

        expect(parent.innerHTML).toBe('<span></span>');
        expect(onNodeCreated).toHaveBeenCalledTimes(1);
        expect(onNodeCreated.calls.argsFor(0)[0]).toBe(group);
        expect(onNodeCreated.calls.argsFor(0)[1]).toBe(parent.querySelector('span'));
    });

    it('General segment and newElements', () => {
        const childMock = document.createElement('span');
        const group = createGeneralSegment(childMock);
        const newElements: Node[] = [];

        spyOn(applyFormat, 'applyFormat');

        handleGeneralSegment(document, parent, group, context, newElements);

        expect(parent.outerHTML).toBe('<div><span><span></span></span></div>');
        expect(context.regularSelection.current.segment).toBe(childMock);
        expect(typeof parent.firstChild).toBe('object');
        expect(parent.firstChild?.firstChild).toBe(childMock);
        expect(context.listFormat.nodeStack).toEqual([]);
        expect(handleBlockGroupChildren).toHaveBeenCalledTimes(1);
        expect(handleBlockGroupChildren).toHaveBeenCalledWith(document, childMock, group, context);
        expect(applyFormat.applyFormat).toHaveBeenCalled();
        expect(newElements.length).toBe(1);
        expect(newElements[0]).toBe(childMock);
    });
});
