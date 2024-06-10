import * as textMutationObserver from '../../../lib/corePlugin/cache/textMutationObserver';
import { DomIndexer, TextMutationObserver } from 'roosterjs-content-model-types';
import { DomIndexerImpl } from '../../../lib/corePlugin/cache/domIndexerImpl';

describe('TextMutationObserverImpl', () => {
    let domIndexer: DomIndexer;
    let onSkipMutation: jasmine.Spy;
    let observer: TextMutationObserver;

    beforeEach(() => {
        domIndexer = new DomIndexerImpl();
        onSkipMutation = jasmine.createSpy('onSkipMutation');
    });

    afterEach(() => {
        observer?.stopObserving();
    });

    it('init', () => {
        const div = document.createElement('div');
        const onMutation = jasmine.createSpy('onMutation');
        textMutationObserver.createTextMutationObserver(
            div,
            domIndexer,
            onMutation,
            onSkipMutation
        );

        expect(onMutation).not.toHaveBeenCalled();
        expect(onSkipMutation).not.toHaveBeenCalled();
    });

    it('not text change', async () => {
        const div = document.createElement('div');
        const onMutation = jasmine.createSpy('onMutation');

        observer = textMutationObserver.createTextMutationObserver(
            div,
            domIndexer,
            onMutation,
            onSkipMutation
        );

        observer.startObserving();

        div.appendChild(document.createElement('br'));

        await new Promise<void>(resolve => {
            window.setTimeout(resolve, 10);
        });

        expect(onMutation).toHaveBeenCalledTimes(1);
        expect(onMutation).toHaveBeenCalledWith(false);
        expect(onSkipMutation).not.toHaveBeenCalled();
    });

    it('text change', async () => {
        const div = document.createElement('div');
        const text = document.createTextNode('test');

        div.appendChild(text);

        const onMutation = jasmine.createSpy('onMutation');
        observer = textMutationObserver.createTextMutationObserver(
            div,
            domIndexer,
            onMutation,
            onSkipMutation
        );

        observer.startObserving();

        text.nodeValue = '1';

        await new Promise<void>(resolve => {
            window.setTimeout(resolve, 10);
        });

        expect(onMutation).toHaveBeenCalledTimes(1);
        expect(onMutation).toHaveBeenCalledWith(true);
        expect(onSkipMutation).not.toHaveBeenCalled();
    });

    it('text change in deeper node', async () => {
        const div = document.createElement('div');
        const span = document.createElement('span');
        const text = document.createTextNode('test');

        span.appendChild(text);
        div.appendChild(span);

        const onMutation = jasmine.createSpy('onMutation');

        observer = textMutationObserver.createTextMutationObserver(
            div,
            domIndexer,
            onMutation,
            onSkipMutation
        );

        observer.startObserving();

        text.nodeValue = '1';

        await new Promise<void>(resolve => {
            window.setTimeout(resolve, 10);
        });

        expect(onMutation).toHaveBeenCalledTimes(1);
        expect(onMutation).toHaveBeenCalledWith(true);
        expect(onSkipMutation).not.toHaveBeenCalled();
    });

    it('text and non-text change', async () => {
        const div = document.createElement('div');
        const text = document.createTextNode('test');

        div.appendChild(text);

        const onMutation = jasmine.createSpy('onMutation');

        observer = textMutationObserver.createTextMutationObserver(
            div,
            domIndexer,
            onMutation,
            onSkipMutation
        );

        observer.startObserving();

        text.nodeValue = '1';
        div.appendChild(document.createElement('br'));

        await new Promise<void>(resolve => {
            window.setTimeout(resolve, 10);
        });

        expect(onMutation).toHaveBeenCalledTimes(1);
        expect(onMutation).toHaveBeenCalledWith(false);
        expect(onSkipMutation).not.toHaveBeenCalled();
    });

    it('flush mutation', async () => {
        const div = document.createElement('div');
        const text = document.createTextNode('test');

        div.appendChild(text);

        const onMutation = jasmine.createSpy('onMutation');
        observer = textMutationObserver.createTextMutationObserver(
            div,
            domIndexer,
            onMutation,
            onSkipMutation
        );

        observer.startObserving();

        text.nodeValue = '1';
        observer.flushMutations();

        await new Promise<void>(resolve => {
            window.setTimeout(resolve, 10);
        });

        expect(onMutation).toHaveBeenCalledWith(true);
        expect(onSkipMutation).not.toHaveBeenCalled();
    });

    it('flush mutation without change', async () => {
        const div = document.createElement('div');
        const text = document.createTextNode('test');

        div.appendChild(text);

        const onMutation = jasmine.createSpy('onMutation');
        observer = textMutationObserver.createTextMutationObserver(
            div,
            domIndexer,
            onMutation,
            onSkipMutation
        );

        observer.startObserving();
        observer.flushMutations();

        await new Promise<void>(resolve => {
            window.setTimeout(resolve, 10);
        });

        expect(onMutation).not.toHaveBeenCalled();
        expect(onSkipMutation).not.toHaveBeenCalled();
    });

    it('flush mutation with a new model', async () => {
        const div = document.createElement('div');
        const text = document.createTextNode('test');

        div.appendChild(text);

        const onMutation = jasmine.createSpy('onMutation');
        observer = textMutationObserver.createTextMutationObserver(
            div,
            domIndexer,
            onMutation,
            onSkipMutation
        );

        observer.startObserving();

        text.nodeValue = '1';

        const newModel = 'MODEL' as any;
        observer.flushMutations(newModel);

        await new Promise<void>(resolve => {
            window.setTimeout(resolve, 10);
        });

        expect(onMutation).not.toHaveBeenCalled();
        expect(onSkipMutation).toHaveBeenCalledWith(newModel);
    });

    it('flush mutation when type in new line - 1', async () => {
        const div = document.createElement('div');
        const br = document.createElement('br');
        const text = document.createTextNode('test');

        div.appendChild(br);

        const onMutation = jasmine.createSpy('onMutation');
        observer = textMutationObserver.createTextMutationObserver(
            div,
            domIndexer,
            onMutation,
            onSkipMutation
        );

        observer.startObserving();

        div.replaceChild(text, br);

        const reconcileChildListSpy = spyOn(domIndexer, 'reconcileChildList').and.returnValue(true);

        observer.flushMutations();

        await new Promise<void>(resolve => {
            window.setTimeout(resolve, 10);
        });

        expect(reconcileChildListSpy).toHaveBeenCalledWith([text], [br]);
        expect(onMutation).not.toHaveBeenCalled();
        expect(onSkipMutation).not.toHaveBeenCalled();
    });

    it('flush mutation when type in new line - 2', async () => {
        const div = document.createElement('div');
        const br = document.createElement('br');
        const text = document.createTextNode('');

        div.appendChild(br);

        const onMutation = jasmine.createSpy('onMutation');
        observer = textMutationObserver.createTextMutationObserver(
            div,
            domIndexer,
            onMutation,
            onSkipMutation
        );

        observer.startObserving();

        div.insertBefore(text, br);
        div.removeChild(br);
        text.nodeValue = 'test';

        const reconcileChildListSpy = spyOn(domIndexer, 'reconcileChildList').and.returnValue(true);

        observer.flushMutations();

        await new Promise<void>(resolve => {
            window.setTimeout(resolve, 10);
        });

        expect(reconcileChildListSpy).toHaveBeenCalledWith([text], [br]);
        expect(onMutation).toHaveBeenCalledWith(true);
        expect(onSkipMutation).not.toHaveBeenCalled();
    });

    it('flush mutation when type in new line, fail to reconcile', async () => {
        const div = document.createElement('div');
        const br = document.createElement('br');
        const text = document.createTextNode('test');

        div.appendChild(br);

        const onMutation = jasmine.createSpy('onMutation');
        observer = textMutationObserver.createTextMutationObserver(
            div,
            domIndexer,
            onMutation,
            onSkipMutation
        );

        observer.startObserving();

        div.replaceChild(text, br);

        const reconcileChildListSpy = spyOn(domIndexer, 'reconcileChildList').and.returnValue(
            false
        );

        observer.flushMutations();

        await new Promise<void>(resolve => {
            window.setTimeout(resolve, 10);
        });

        expect(reconcileChildListSpy).toHaveBeenCalledWith([text], [br]);
        expect(onMutation).toHaveBeenCalledWith(false);
        expect(onSkipMutation).not.toHaveBeenCalled();
    });

    it('mutation happens in different root', async () => {
        const div = document.createElement('div');
        const div1 = document.createElement('div');
        const div2 = document.createElement('div');
        const br = document.createElement('br');
        const text = document.createTextNode('test');

        div1.appendChild(br);
        div.appendChild(div1);
        div.appendChild(div2);

        const onMutation = jasmine.createSpy('onMutation');
        observer = textMutationObserver.createTextMutationObserver(
            div,
            domIndexer,
            onMutation,
            onSkipMutation
        );

        observer.startObserving();

        div1.removeChild(br);
        div2.appendChild(text);

        const reconcileChildListSpy = spyOn(domIndexer, 'reconcileChildList').and.returnValue(
            false
        );

        observer.flushMutations();

        await new Promise<void>(resolve => {
            window.setTimeout(resolve, 10);
        });

        expect(reconcileChildListSpy).not.toHaveBeenCalled();
        expect(onMutation).toHaveBeenCalledWith(false);
        expect(onSkipMutation).not.toHaveBeenCalled();
    });

    it('attribute change', async () => {
        const div = document.createElement('div');
        const div1 = document.createElement('div');

        div.appendChild(div1);

        const onMutation = jasmine.createSpy('onMutation');
        observer = textMutationObserver.createTextMutationObserver(
            div,
            domIndexer,
            onMutation,
            onSkipMutation
        );

        observer.startObserving();

        div1.id = 'div1';

        const reconcileChildListSpy = spyOn(domIndexer, 'reconcileChildList').and.returnValue(
            false
        );

        observer.flushMutations();

        await new Promise<void>(resolve => {
            window.setTimeout(resolve, 10);
        });

        expect(reconcileChildListSpy).not.toHaveBeenCalled();
        expect(onMutation).toHaveBeenCalledWith(false);
        expect(onSkipMutation).not.toHaveBeenCalled();
    });
});
