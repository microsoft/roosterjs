import * as mergeNode from '../../../lib/modelToDom/optimizers/mergeNode';
import * as removeUnnecessarySpan from '../../../lib/modelToDom/optimizers/removeUnnecessarySpan';
import { optimize } from '../../../lib/modelToDom/optimizers/optimize';

describe('optimize', () => {
    beforeEach(() => {
        spyOn(mergeNode, 'mergeNode');
        spyOn(removeUnnecessarySpan, 'removeUnnecessarySpan');
    });

    it('Optimize Level 0', () => {
        const div = document.createElement('div');
        optimize(div, 0);

        expect(mergeNode.mergeNode).not.toHaveBeenCalled();
        expect(removeUnnecessarySpan.removeUnnecessarySpan).not.toHaveBeenCalled();
    });

    it('Optimize Level 1', () => {
        const div = document.createElement('div');
        optimize(div, 1);

        expect(mergeNode.mergeNode).toHaveBeenCalled();
        expect(removeUnnecessarySpan.removeUnnecessarySpan).not.toHaveBeenCalled();
    });

    it('Optimize Level 2', () => {
        const div = document.createElement('div');
        optimize(div, 2);

        expect(mergeNode.mergeNode).toHaveBeenCalled();
        expect(removeUnnecessarySpan.removeUnnecessarySpan).toHaveBeenCalled();
    });

    it('Recursively optimize Level 2', () => {
        const div = document.createElement('div');
        const span = document.createElement('span');
        div.appendChild(span);

        optimize(div, 2);

        expect(mergeNode.mergeNode).toHaveBeenCalledTimes(2);
        expect(mergeNode.mergeNode).toHaveBeenCalledWith(div);
        expect(mergeNode.mergeNode).toHaveBeenCalledWith(span);

        expect(removeUnnecessarySpan.removeUnnecessarySpan).toHaveBeenCalledTimes(2);
        expect(removeUnnecessarySpan.removeUnnecessarySpan).toHaveBeenCalledWith(div);
        expect(removeUnnecessarySpan.removeUnnecessarySpan).toHaveBeenCalledWith(span);
    });
});
