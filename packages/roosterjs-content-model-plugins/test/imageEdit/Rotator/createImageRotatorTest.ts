import { createImageRotator } from '../../../lib/imageEdit/Rotator/createImageRotator';

const rotatorOuterHTML =
    '<div style="position:absolute;left:50%;width:1px;background-color:#DB626C;top:-21px;height:15px;margin-left:-1px;" class="r_rotateC"><div style="position:absolute;background-color:#DB626C;border:solid 1px #DB626C;border-radius:50%;width:32px;height:32px;left:-17px;cursor:move;top:-32px;line-height: 0px;" class="r_rotateH"><svg style="width:16px;height:16px;margin: 8px 8px"><path d="M 10.5,10.0 A 3.8,3.8 0 1 1 6.7,6.3" transform="matrix(1.1 1.1 -1.1 1.1 11.6 -10.8)" fill-opacity="0" stroke="#DB626C"></path><path d="M12.0 3.648l.884-.884.53 2.298-2.298-.53z" stroke="#DB626C"></path></svg></div></div>';

describe('createImageRotator', () => {
    it('should create the croppers', () => {
        const result = createImageRotator(document, {
            borderColor: '#DB626C',
            rotateHandleBackColor: '#DB626C',
        } as any);
        const div = document.createElement('div');
        document.body.appendChild(div);
        div.innerHTML = rotatorOuterHTML;
        const expectedRotator = div.firstElementChild! as HTMLDivElement;

        expect(result).toEqual([expectedRotator]);
        document.body.removeChild(div);
    });
});
