// @ts-nocheck

import e from "../e.js";
import { getData } from "../../main.js";
import callUpdatePreview from "../folders/updatePreview.js";

async function applyPreset(data: any) {
    e.icon.value = data?.icon?.text ?? "";

    e.baseColor.value = data?.color?.base ?? "#FFD65C";
    e.iconColor.value = data?.color?.icon ?? "";
    
    e.baseColor._updateColor?.();
    e.iconColor._updateColor?.();
    callUpdatePreview(getData());
}

export default applyPreset;