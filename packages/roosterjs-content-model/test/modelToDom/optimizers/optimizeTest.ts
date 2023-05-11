import * as mergeNode from '../../../lib/modelToDom/optimizers/mergeNode';
import * as removeUnnecessarySpan from '../../../lib/modelToDom/optimizers/removeUnnecessarySpan';
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
