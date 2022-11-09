import * as applyFormat from '../../../lib/modelToDom/utils/applyFormat';
import { ContentModelBlockGroup } from '../../../lib/publicTypes/block/group/ContentModelBlockGroup';
import { ContentModelHandler } from '../../../lib/publicTypes/context/ContentModelHandler';
import { ContentModelListItem } from '../../../lib/publicTypes/block/group/ContentModelListItem';
import { ContentModelQuote } from '../../../lib/publicTypes/block/group/ContentModelQuote';
import { createGeneralBlock } from '../../../lib/modelApi/creators/createGeneralBlock';
import { createGeneralSegment } from '../../../lib/modelApi/creators/createGeneralSegment';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { handleGeneralModel } from '../../../lib/modelToDom/handlers/handleGeneralModel';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';

describe('handleBlockGroup', () => {
    let context: ModelToDomContext;
    let parent: HTMLDivElement;
    let handleBlockGroupChildren: jasmine.Spy<ContentModelHandler<ContentModelBlockGroup>>;
    let handleListItem: jasmine.Spy<ContentModelHandler<ContentModelListItem>>;
    let handleQuote: jasmine.Spy<ContentModelHandler<ContentModelQuote>>;

    beforeEach(() => {
        handleBlockGroupChildren = jasmine.createSpy('handleBlockGroupChildren');
        handleListItem = jasmine.createSpy('handleListItem');
        handleQuote = jasmine.createSpy('handleQuote');

        context = createModelToDomContext(undefined, {
            modelHandlerOverride: {
                blockGroupChildren: handleBlockGroupChildren,
                listItem: handleListItem,
                quote: handleQuote,
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

        handleGeneralModel(document, parent, group, context);

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

        handleGeneralModel(document, parent, group, context);

        expect(parent.outerHTML).toBe('<div><span></span></div>');
        expect(context.regularSelection.current.segment).toBe(clonedChild);
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

        handleGeneralModel(document, parent, group, context);

        expect(parent.outerHTML).toBe('<div><span></span></div>');
        expect(context.regularSelection.current.segment).toBeNull();
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
        expect(applyFormat.applyFormat).toHaveBeenCalled();
    });

    it('General segment: element with link', () => {
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

        spyOn(applyFormat, 'applyFormat').and.callThrough();

        handleGeneralModel(document, parent, group, context);

        expect(parent.outerHTML).toBe('<div><a href="/test"><span></span></a></div>');
        expect(context.regularSelection.current.segment).toBeNull();
        expect(typeof parent.firstChild).toBe('object');
        expect(parent.firstChild).toBe(clonedChild.parentElement);
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
});
