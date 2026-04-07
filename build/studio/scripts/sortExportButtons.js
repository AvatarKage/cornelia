function getOS() {
    const ua = navigator.userAgent;
    if (ua.includes("Win"))
        return "windows";
    if (ua.includes("Mac"))
        return "mac";
    if (ua.includes("Linux"))
        return "linux";
    if (ua.includes("Android"))
        return "android";
    return "unknown";
}
const priority = {
    exportWindows: "windows",
    exportMacOS: "mac",
    exportLinux: "linux",
    exportAndroid: "android",
    exportVector: "unknown"
};
function sortExportButtons() {
    const container = document.getElementById("saveButtons");
    if (!container)
        return;
    const os = getOS();
    const buttons = Array.from(container.children);
    buttons.sort((a, b) => {
        const aOS = priority[a.id] ?? "unknown";
        const bOS = priority[b.id] ?? "unknown";
        const aMatch = aOS === os ? 0 : 1;
        const bMatch = bOS === os ? 0 : 1;
        return aMatch - bMatch;
    });
    buttons.forEach(btn => container.appendChild(btn));
}
export default sortExportButtons;
