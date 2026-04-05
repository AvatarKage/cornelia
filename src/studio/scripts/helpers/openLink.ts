const UTM: Record<string, string> = {
    utm_source: "cornalia",
    utm_medium: "app",
    utm_campaign: "export_page"
};

function openLink(
    url: string,
    extra?: Record<string, string | number | boolean>
): void {
    const finalUrl = new URL(url);

    Object.entries(UTM).forEach(([key, value]) => {
        finalUrl.searchParams.set(key, value);
    });

    if (extra) {
        Object.entries(extra).forEach(([key, value]) => {
            finalUrl.searchParams.set(key, String(value));
        });
    }

    window.open(finalUrl.toString(), "_blank", "noopener,noreferrer");
}

export default openLink;