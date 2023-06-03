import * as applyFormat from '../../../lib/modelToDom/utils/applyFormat';
import * as stackFormat from '../../../lib/modelToDom/utils/stackFormat';
import { ContentModelBlockGroup } from '../../../lib/publicTypes/group/ContentModelBlockGroup';
import { ContentModelFormatContainer } from '../../../lib/publicTypes/group/ContentModelFormatContainer';
import { ContentModelListItem } from '../../../lib/publicTypes/group/ContentModelListItem';
import { createGeneralBlock } from '../../../lib/modelApi/creators/createGeneralBlock';
import { createGeneralSegment } from '../../../lib/modelApi/creators/createGeneralSegment';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { handleGeneralModel } from '../../../lib/modelToDom/handlers/handleGeneralModel';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';
import {
    ContentModelBlockHandler,
    ContentModelHandler,
} from '../../../lib/publicTypes/context/ContentModelHandler';

describe('handleBlockGroup', () => {
    let context: ModelToDomContext;
    let parent: HTMLDivElement;
    let handleBlockGroupChildren: jasmine.Spy<ContentModelHandler<ContentModelBlockGroup>>;
    let handleListItem: jasmine.Spy<ContentModelBlockHandler<ContentModelListItem>>;
    let handleQuote: jasmine.Spy<ContentModelBlockHandler<ContentModelFormatContainer>>;

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
        const clonedChild = document.createElement('span');
        const childMock = ({
            cloneNode: () => clonedChild,
        } as any) as HTMLElement;
        const group = createGeneralBlock(childMock);

        spyOn(applyFormat, 'applyFormat');

        handleGeneralModel(document, parent, group, context, null);

        expect(parent.outerHTML).toBe('<div><span></span></div>');
        expect(typeof parent.firstChild).toBe('object');
        expect(parent.firstChild).toBe(clonedChild);
        expect(context.listFormat.nodeStack).toEqual([]);
        expect(handleBlockGroupChildren).toHaveBeenCalledTimes(1);
        expect(handleBlockGroupChildren).toHaveBeenCalledWith(
            document,
            clonedChild,
            group,
            context
        );
        expect(applyFormat.applyFormat).not.toHaveBeenCalled();
    });

    it('General segment: empty element', () => {
        const clonedChild = document.createElement('span');
        const childMock = ({
            cloneNode: () => clonedChild,
        } as any) as HTMLElement;
        const group = createGeneralSegment(childMock);

        spyOn(applyFormat, 'applyFormat');

        handleGeneralModel(document, parent, group, context, null);

        expect(parent.outerHTML).toBe('<div><span><span></span></span></div>');
        expect(context.regularSelection.current.segment).toBe(clonedChild);
        expect(typeof parent.firstChild).toBe('object');
        expect(parent.firstChild?.firstChild).toBe(clonedChild);
        expect(context.listFormat.nodeStack).toEqual([]);
        expect(handleBlockGroupChildren).toHaveBeenCalledTimes(1);
        expect(handleBlockGroupChildren).toHaveBeenCalledWith(
            document,
            clonedChild,
            group,
            context
        );
        expect(applyFormat.applyFormat).toHaveBeenCalled();
    });

    it('General segment: element with child', () => {
        const clonedChild = document.createElement('span');
        const childMock = ({
            cloneNode: () => clonedChild,
            firstChild: true,
        } as any) as HTMLElement;
        const group = createGeneralSegment(childMock);

        spyOn(applyFormat, 'applyFormat');

        handleGeneralModel(document, parent, group, context, null);

        expect(parent.outerHTML).toBe('<div><span><span></span></span></div>');
        expect(context.regularSelection.current.segment).toBe(clonedChild);
        expect(typeof parent.firstChild).toBe('object');
        expect(parent.firstChild?.firstChild).toBe(clonedChild);
        expect(context.listFormat.nodeStack).toEqual([]);
        expect(handleBlockGroupChildren).toHaveBeenCalledTimes(1);
        expect(handleBlockGroupChildren).toHaveBeenCalledWith(
            document,
            clonedChild,
            group,
            context
        );
        expect(applyFormat.applyFormat).toHaveBeenCalled();
    });

    it('General segment: element with link', () => {
        const clonedChild = document.createElement('span');
        const childMock = ({
            cloneNode: () => clonedChild,
            firstChild: true,
        } as any) as HTMLElement;
        const group = createGeneralSegment(childMock);

        group.link = {
            format: {
                href: '/test',
                underline: true,
            },
            dataset: {},
        };

        spyOn(applyFormat, 'applyFormat').and.callThrough();

        handleGeneralModel(document, parent, group, context, null);

        expect(parent.outerHTML).toBe('<div><span><a href="/test"><span></span></a></span></div>');
        expect(context.regularSelection.current.segment).toBe(clonedChild);
        expect(typeof parent.firstChild).toBe('object');
        expect(parent.firstChild?.firstChild).toBe(clonedChild.parentElement);
        expect(context.listFormat.nodeStack).toEqual([]);
        expect(handleBlockGroupChildren).toHaveBeenCalledTimes(1);
        expect(handleBlockGroupChildren).toHaveBeenCalledWith(
            document,
            clonedChild,
            group,
            context
        );
        expect(applyFormat.applyFormat).toHaveBeenCalled();
    });

    it('call stackFormat', () => {
        const clonedChild = document.createElement('span');
        const childMock = ({
            cloneNode: () => clonedChild,
            firstChild: true,
        } as any) as HTMLElement;
        const group = createGeneralSegment(childMock, { underline: true });

        group.link = {
            format: {
                href: '/test',
            },
            dataset: {},
        };

        spyOn(stackFormat, 'stackFormat').and.callThrough();

        handleGeneralModel(document, parent, group, context, null);

        expect(stackFormat.stackFormat).toHaveBeenCalledTimes(1);
        expect((<jasmine.Spy>stackFormat.stackFormat).calls.argsFor(0)[1]).toBe('a');
    });

    it('General block with refNode', () => {
        const clonedChild = document.createElement('span');
        const childMock = ({
            cloneNode: () => clonedChild,
        } as any) as HTMLElement;
        const group = createGeneralBlock(childMock);

        spyOn(applyFormat, 'applyFormat');

        const br = document.createElement('br');
        parent.appendChild(br);

        const result = handleGeneralModel(document, parent, group, context, br);

        expect(parent.outerHTML).toBe('<div><span></span><br></div>');
        expect(typeof parent.firstChild).toBe('object');
        expect(parent.firstChild).toBe(clonedChild);
        expect(context.listFormat.nodeStack).toEqual([]);
        expect(handleBlockGroupChildren).toHaveBeenCalledTimes(1);
        expect(handleBlockGroupChildren).toHaveBeenCalledWith(
            document,
            clonedChild,
            group,
            context
        );
        expect(applyFormat.applyFormat).not.toHaveBeenCalled();
        expect(result).toBe(br);
        expect(group.element).toBe(clonedChild);
    });

    it('General block with refNode, already in target node', () => {
        const node = document.createElement('span');
        const group = createGeneralBlock(node);
        const br = document.createElement('br');

        parent.appendChild(node);
        parent.appendChild(br);

        const result = handleGeneralModel(document, parent, group, context, node);

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

        handleGeneralModel(document, parent, group, context, null);

        expect(parent.innerHTML).toBe('<span></span>');
        expect(onNodeCreated).toHaveBeenCalledTimes(1);
        expect(onNodeCreated.calls.argsFor(0)[0]).toBe(group);
        expect(onNodeCreated.calls.argsFor(0)[1]).toBe(parent.querySelector('span'));
    });
});
