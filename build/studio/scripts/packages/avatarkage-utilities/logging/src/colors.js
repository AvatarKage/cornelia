function color(code) {
    return (text) => `\x1b[${code}m${text}\x1b[0m`;
}
function bgColor(bg, fg) {
    return (text) => `\x1b[${bg}m\x1b[${fg}m${text}\x1b[0m`;
}
const colors = {
    info: color(90),
    success: color(32),
    warn: color(33),
    error: color(31),
    debug: color(35),
    trace: color(36),
    terminate: bgColor(41, 30),
};
export default colors;
