import * as mergeNode from '../../../lib/modelToDom/optimizers/mergeNode';
import * as removeUnnecessarySpan from '../../../lib/modelToDom/optimizers/removeUnnecessarySpan';
import { commitEntity } from 'roosterjs-editor-dom';
import { optimize } from '../../../lib/modelToDom/optimizers/optimize';

describe('optimize', () => {
    beforeEach(() => {
        spyOn(mergeNode, 'mergeNode');
        spyOn(removeUnnecessarySpan, 'removeUnnecessarySpan');
    });

    it('Optimize', () => {
        const div = document.createElement('div');
        optimize(div);

        expect(mergeNode.mergeNode).toHaveBeenCalled();
        expect(removeUnnecessarySpan.removeUnnecessarySpan).toHaveBeenCalled();
    });

    it('Recursively optimize', () => {
        const div = document.createElement('div');
        const span = document.createElement('span');
        div.appendChild(span);

        optimize(div);

        expect(mergeNode.mergeNode).toHaveBeenCalledTimes(2);
        expect(mergeNode.mergeNode).toHaveBeenCalledWith(div);
        expect(mergeNode.mergeNode).toHaveBeenCalledWith(span);

        expect(removeUnnecessarySpan.removeUnnecessarySpan).toHaveBeenCalledTimes(2);
        expect(removeUnnecessarySpan.removeUnnecessarySpan).toHaveBeenCalledWith(div);
        expect(removeUnnecessarySpan.removeUnnecessarySpan).toHaveBeenCalledWith(span);
    });
});

describe('real optimization', () => {
    it('Do not optimize entity', () => {
        const div = document.createElement('div');
        const span1 = document.createElement('span');
        const span2 = document.createElement('span');
        const childSpan = document.createElement('span');

        span1.textContent = 'test1';
        childSpan.textContent = 'entity';
        commitEntity(span2, 'test', true);

        span2.appendChild(childSpan);
        div.appendChild(span1);
        div.appendChild(span2);

        optimize(div);

        expect(div.outerHTML).toBe(
            '<div>test1<span class="_Entity _EType_test _EReadonly_1" contenteditable="false"><span>entity</span></span></div>'
        );
    });
});
