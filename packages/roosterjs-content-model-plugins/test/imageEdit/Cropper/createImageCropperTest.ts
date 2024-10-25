import { createImageCropper } from '../../../lib/imageEdit/Cropper/createImageCropper';

const cropperCenterHTML =
    '<div style="position:absolute;overflow:hidden;inset:0px;" class="r_cropC"><div style="position:absolute;pointer-events:auto;cursor:sw-resize;left:0;bottom:0;width:22px;height:22px;transform:rotate(0deg)" class="r_cropH" data-x="w" data-y="s"><div style="position:absolute;left:0px;bottom:0px;right:0px;height:7px;;background-color:white"></div><div style="position:absolute;left:0px;bottom:0px;top:0px;width:7px;;background-color:white"></div><div style="position:absolute;left:1px;bottom:1px;right:1px;height:5px;;background-color:black"></div><div style="position:absolute;left:1px;bottom:1px;top:1px;width:5px;;background-color:black"></div></div><div style="position:absolute;pointer-events:auto;cursor:nw-resize;left:0;top:0;width:22px;height:22px;transform:rotate(90deg)" class="r_cropH" data-x="w" data-y="n"><div style="position:absolute;left:0px;bottom:0px;right:0px;height:7px;;background-color:white"></div><div style="position:absolute;left:0px;bottom:0px;top:0px;width:7px;;background-color:white"></div><div style="position:absolute;left:1px;bottom:1px;right:1px;height:5px;;background-color:black"></div><div style="position:absolute;left:1px;bottom:1px;top:1px;width:5px;;background-color:black"></div></div><div style="position:absolute;pointer-events:auto;cursor:se-resize;right:0;bottom:0;width:22px;height:22px;transform:rotate(270deg)" class="r_cropH" data-x="e" data-y="s"><div style="position:absolute;left:0px;bottom:0px;right:0px;height:7px;;background-color:white"></div><div style="position:absolute;left:0px;bottom:0px;top:0px;width:7px;;background-color:white"></div><div style="position:absolute;left:1px;bottom:1px;right:1px;height:5px;;background-color:black"></div><div style="position:absolute;left:1px;bottom:1px;top:1px;width:5px;;background-color:black"></div></div><div style="position:absolute;pointer-events:auto;cursor:ne-resize;right:0;top:0;width:22px;height:22px;transform:rotate(180deg)" class="r_cropH" data-x="e" data-y="n"><div style="position:absolute;left:0px;bottom:0px;right:0px;height:7px;;background-color:white"></div><div style="position:absolute;left:0px;bottom:0px;top:0px;width:7px;;background-color:white"></div><div style="position:absolute;left:1px;bottom:1px;right:1px;height:5px;;background-color:black"></div><div style="position:absolute;left:1px;bottom:1px;top:1px;width:5px;;background-color:black"></div></div></div>';
const cropTopLeftHTML =
    '<div style="position:;background-color:rgb(0,0,0,0.5);pointer-events:none" class="r_cropO"></div>';
const cropTopRightHTML =
    '<div style="position:;background-color:rgb(0,0,0,0.5);pointer-events:none" class="r_cropO"></div>';
const cropBottomLeftHTML =
    '<div style="position:;background-color:rgb(0,0,0,0.5);pointer-events:none" class="r_cropO"></div>';
const cropBottomRightHTML =
    '<div style="position:;background-color:rgb(0,0,0,0.5);pointer-events:none" class="r_cropO"></div>';

describe('createImageCropper', () => {
    it('should create the croppers', () => {
        const croppers = createImageCropper(document);
        const cropCenterDiv = document.createElement('div');
        const cropOverlayTopLeftDiv = document.createElement('div');
        const cropOverlayTopRightDiv = document.createElement('div');
        const cropOverlayBottomLeftDiv = document.createElement('div');
        const cropOverlayBottomRightDiv = document.createElement('div');
        document.body.appendChild(cropCenterDiv);
        document.body.appendChild(cropOverlayTopLeftDiv);
        document.body.appendChild(cropOverlayTopRightDiv);
        document.body.appendChild(cropOverlayBottomLeftDiv);
        document.body.appendChild(cropOverlayBottomRightDiv);
        cropCenterDiv.innerHTML = cropperCenterHTML;
        cropOverlayTopLeftDiv.innerHTML = cropTopLeftHTML;
        cropOverlayTopRightDiv.innerHTML = cropTopRightHTML;
        cropOverlayBottomLeftDiv.innerHTML = cropBottomLeftHTML;
        cropOverlayBottomRightDiv.innerHTML = cropBottomRightHTML;
        const cropCenter = cropCenterDiv.firstElementChild!;
        const cropOverlayTopRight = cropOverlayTopRightDiv.firstElementChild!;
        const cropOverlayTopLeft = cropOverlayTopLeftDiv.firstElementChild!;
        const cropOverlayBottomLeft = cropOverlayBottomLeftDiv.firstElementChild!;
        const cropOverlayBottomRight = cropOverlayBottomRightDiv.firstElementChild!;

        const expectedCropper = [
            cropCenter,
            cropOverlayTopLeft,
            cropOverlayTopRight,
            cropOverlayBottomLeft,
            cropOverlayBottomRight,
        ] as HTMLDivElement[];

        expect(JSON.stringify(croppers)).toEqual(JSON.stringify(expectedCropper));

        cropCenterDiv.remove();
        cropOverlayTopLeftDiv.remove();
        cropOverlayTopRightDiv.remove();
        cropOverlayBottomLeftDiv.remove();
        cropOverlayBottomRightDiv.remove();
    });
});
