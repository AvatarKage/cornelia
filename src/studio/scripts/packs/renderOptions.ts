import { state } from "../../main.js";
import callUpdatePreview from "../folders/updatePreview.js";
import setSelectValue from "../helpers/setSelectValue.js";

const styleContainer = document.getElementById("styleOptions") as HTMLDivElement | null;
const variantContainer = document.getElementById("variantOptions") as HTMLDivElement | null;
const fontContainer = document.getElementById("fontOptions") as HTMLDivElement | null;

function sortWithPriority<T extends string>(values: T[], priority: string[]): T[] {
    return values.sort((a, b) => {
        const ia = priority.indexOf(a);
        const ib = priority.indexOf(b);

        if (ia === -1 && ib === -1) return a.localeCompare(b);
        if (ia === -1) return 1;
        if (ib === -1) return -1;

        return ia - ib;
    });
}

function createOption(
    key: string,
    name: string,
    onClick?: () => void
): HTMLDivElement {
    const el = document.createElement("div");
    el.className = "option";
    el.dataset.value = key;
    el.textContent = name;

    if (onClick) el.onclick = onClick;

    return el;
}

function getLocalData(packs: any[]) {
    return {
        packs,
        isCustomBackColor: state.isCustomBackColor,
        isCustomIconColor: state.isCustomIconColor,
        selectedStyle: state.selectedStyle,
        selectedVariant: state.selectedVariant,
        selectedFont: state.selectedFont
    };
}

async function renderStyles(packs: any[]): Promise<void> {
    if (!styleContainer) return;

    styleContainer.innerHTML = "";

    const styles = new Set<string>();

    packs.forEach((pack) => {
        Object.keys(pack.content?.assets?.folders ?? {}).forEach((style) => {
            styles.add(style);
        });
    });

    const style_priority = ["shaded", "outline", "flat"];
    const sortedStyles = sortWithPriority([...styles], style_priority);

    const topStyle = sortedStyles[0] ?? null;

    const formatStyleName = (style: string) =>
        style && style.length > 0
            ? style.charAt(0).toUpperCase() + style.slice(1)
            : style;

    const selectStyle = async (style: string) => {
        state.selectedStyle = style;

        setSelectValue("style", style);

        await renderVariants(packs, style);
    };

    for (const style of sortedStyles) {
        const label = formatStyleName(style);

        const el = createOption(style, label, () => {
            selectStyle(style);
        });

        styleContainer.appendChild(el);
    }

    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

    if (topStyle) {
        state.selectedStyle = topStyle;

        setSelectValue("style", topStyle);

        await renderVariants(packs, topStyle);
    }
}

async function renderVariants(packs: any[], style: string): Promise<void> {
    if (!variantContainer) return;

    variantContainer.innerHTML = "";

    let topVariant: string | null = null;

    for (const pack of packs) {
        const folders = pack.content?.assets?.folders ?? {};
        const variants = folders[style];

        if (!variants) continue;

        const entries = Object.entries(variants);

        const sortedEntries = entries.sort(([a], [b]) => {
            const getPriority = (key: string) => {
                const lower = key.toLowerCase();

                if (lower.includes("left")) return 0;
                if (lower.includes("center")) return 1;
                if (lower.includes("right")) return 2;

                return 999;
            };

            const pa = getPriority(a);
            const pb = getPriority(b);

            if (pa !== pb) return pa - pb;

            return a.localeCompare(b);
        });

        for (const [key, data] of sortedEntries) {
            if (!topVariant) topVariant = key;

            const el = createOption(key, (data as any).name ?? key, async () => {
                setSelectValue("variant", key);

                let dataFound: any = null;

                for (const pack of packs) {
                    const folders = pack.content?.assets?.folders ?? {};
                    const v = folders[style];

                    if (v?.[key]) {
                        dataFound = v[key];
                        break;
                    }
                }

                if (dataFound) {
                    state.selectedVariant = await dataFound.content();
                    callUpdatePreview(getLocalData(packs));
                }
            });

            variantContainer.appendChild(el);
        }
    }

    if (topVariant) {
        setSelectValue("variant", topVariant);

        let dataFound: any = null;

        for (const pack of packs) {
            const folders = pack.content?.assets?.folders ?? {};
            const v = folders[style];

            if (v?.[topVariant]) {
                dataFound = v[topVariant];
                break;
            }
        }

        if (dataFound) {
            state.selectedVariant = await dataFound.content();
            callUpdatePreview(getLocalData(packs));
        }
    }
}

function renderFonts(packs: any[]): void {
    if (!fontContainer) return;

    fontContainer.innerHTML = "";

    let topFont: string | null = null;

    const selectFont = (key: string) => {
        setSelectValue("font", key);

        let dataFound: any = null;

        for (const pack of packs) {
            const fonts = pack.content?.assets?.fonts ?? {};
            if (fonts[key]) {
                dataFound = fonts[key];
                break;
            }
        }

        if (dataFound) {
            state.selectedFont = dataFound.content;
            callUpdatePreview(getLocalData(packs));
        }
    };

    const allFonts: { key: string; data: any }[] = [];

    for (const pack of packs) {
        const fonts = pack.content?.assets?.fonts ?? {};
        for (const [key, data] of Object.entries(fonts)) {
            allFonts.push({ key, data });
        }
    }

    const normalize = (k: string) => k.trim().toLowerCase();

    const isJetBrains = (k: string) =>
        normalize(k).includes("jetbrains");

    const isPlaywrite = (k: string) =>
        normalize(k).includes("playwrite");

    allFonts.sort((a, b) => {
        const aJet = isJetBrains(a.key);
        const bJet = isJetBrains(b.key);

        if (aJet && !bJet) return -1;
        if (!aJet && bJet) return 1;

        const aPlay = isPlaywrite(a.key);
        const bPlay = isPlaywrite(b.key);

        if (aPlay && !bPlay) return -1;
        if (!aPlay && bPlay) return 1;

        return a.key.localeCompare(b.key);
    });

    for (const { key, data } of allFonts) {
        if (!topFont) topFont = key;

        const el = createOption(
            key,
            (data as any).name ?? key,
            () => selectFont(key)
        );

        fontContainer.appendChild(el);
    }

    if (topFont) {
        selectFont(topFont);
    }
}

export {
    renderStyles,
    renderVariants,
    renderFonts
}