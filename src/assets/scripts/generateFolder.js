import path from "path";
import fs from "fs";
import pkg from 'canvas';
const { createCanvas, registerFont } = pkg;
import { Canvg } from "canvg";
import pkg2 from 'jsdom';
const { JSDOM } = pkg2;
import pngToIco from "png-to-ico";

import config from "../../../.OLD/backend/config/index.ts";
import recolor from "./recolor.js";
import injectFont from "./injectFont.js";
import { snowflake } from "../../../.OLD/backend/server.ts";
import { getColor, scaleSVG } from "../../../.OLD/backend/helpers/index.ts";

async function generateFolder(options = {}) {
    let {
        style = "shaded",
        variant = "left1",
        baseColor = "#FFD65C",
        backColor = "#000000",
        iconColor = "#000000",
        mediumIcon = "",
        smallIcon = "",
        text = "",
        saturation = 1,
        brightness = 1,
        contrast = 1,
        isCustomBackColor = false,
        isCustomIconColor = false,
        folder = "",
        saveSVG = false,
        savePNG = false,
        saveICO = true,
        width = 256,
        height = 256,
    } = options;

    baseColor = getColor(baseColor);
    backColor = getColor(backColor);
    iconColor = getColor(iconColor);

    const fontDir = path.join(config.folders.assets, "fonts", "jetbrains");
    const svgDir = path.join(config.folders.assets, "svg", style);

    [config.folders.assets, fontDir, svgDir, config.folders.generated].forEach((p) => {
        if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
    });

    const fontPath = path.join(fontDir, "nerdfont.ttf");
    if (fs.existsSync(fontPath)) {
        registerFont(fontPath, { family: "jetbrains-nerdfont" });
    } else {
        console.warn(`Font file not found: ${fontPath}. Text rendering may fail.`);
    }

    const svgPath = path.join(svgDir, `${variant}.svg`);
    if (!fs.existsSync(svgPath)) throw new Error(`SVG template not found: ${svgPath}`);
    let svg = fs.readFileSync(svgPath, "utf8");

    svg = recolor(
        svg,
        style,
        variant,
        baseColor,
        backColor,
        iconColor,
        mediumIcon,
        smallIcon,
        text,
        saturation,
        brightness,
        contrast,
        isCustomBackColor,
        isCustomIconColor
    );

    if (mediumIcon || smallIcon || text) {
        svg = injectFont(svg);
    }

    const genFolder = path.join(config.folders.generated, style, variant, folder);
    fs.mkdirSync(genFolder, { recursive: true });

    let id = "";
    if (saveSVG || savePNG || saveICO) {
        id = snowflake.generate();
    }

    if (saveSVG) {
        const svgFile = path.join(genFolder, `${id}.svg`);
        fs.writeFileSync(svgFile, svg, "utf8");
    }

    const { window } = new JSDOM(`<!DOCTYPE html>`);
    const DOMParser = window.DOMParser;

    let pngBuffer = null;
    if (savePNG) {
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext("2d");

        const scaledSVG = scaleSVG(svg, width, height);
        const v = Canvg.fromString(ctx, scaledSVG, { DOMParser });
        await v.render();

        pngBuffer = canvas.toBuffer("image/png");
        const pngFile = path.join(genFolder, `${id}.png`);
        fs.writeFileSync(pngFile, pngBuffer);
    }

    if (saveICO) {
        const sizes = [16, 32, 48, 64, 128, 256];
        const pngBuffers = [];

        for (const size of sizes) {
            const canvas = createCanvas(size, size);
            const ctx = canvas.getContext("2d");
            ctx.imageSmoothingQuality = "high";

            const scaledSVG = scaleSVG(svg, size, size);
            const v = Canvg.fromString(ctx, scaledSVG, { DOMParser, ignoreDimensions: true });
            await v.render();

            pngBuffers.push(canvas.toBuffer("image/png"));
        }

        try {
            const icoBuffer = await pngToIco(pngBuffers);
            const icoFile = path.join(genFolder, `${id}.ico`);
            fs.writeFileSync(icoFile, icoBuffer);
        } catch (err) {
            console.error("Failed to generate ICO:", err);
        }
    }

    return { id, options: {
            style,
            variant,
            baseColor,
            backColor,
            iconColor,
            mediumIcon,
            smallIcon,
            text,
            saturation,
            brightness,
            contrast,
            isCustomBackColor,
            isCustomIconColor,
            folder,
            saveSVG,
            savePNG,
            saveICO,
            width,
            height,
        }
    }
}

export default generateFolder;