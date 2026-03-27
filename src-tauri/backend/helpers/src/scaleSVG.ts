function scaleSVG(svg: string, width: number, height: number) {
    if (!svg.includes('viewBox')) {
        return svg.replace(
            /<svg([^>]*)>/,
            `<svg$1 width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`
        );
    } else {
        return svg.replace(
            /<svg([^>]*)width="[^"]*"([^>]*)>/,
            `<svg$1 width="${width}"$2>`
        ).replace(
            /<svg([^>]*)height="[^"]*"([^>]*)>/,
            `<svg$1 height="${height}"$2>`
        );
    }
}

export default scaleSVG;