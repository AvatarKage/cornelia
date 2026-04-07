document.addEventListener('DOMContentLoaded', () => {
    const tooltip = document.getElementById('tooltips');
    let timeout_show, timeout_hide;
    let visible = false;
    let current_target = null;
    let tooltip_height = 0;
    function define_tooltip_height() {
        tooltip.style.visibility = 'hidden';
        tooltip.style.opacity = '0';
        tooltip.classList.add('show');
        tooltip_height = tooltip.getBoundingClientRect().height;
        tooltip.classList.remove('show');
        tooltip.style.visibility = 'hidden';
    }
    define_tooltip_height();
    function rgbToHex(rgb) {
        const result = rgb.match(/\d+/g);
        if (!result)
            return null;
        const [r, g, b] = result.map(n => Math.max(0, Math.min(255, parseInt(n, 10)))
            .toString(16)
            .padStart(2, '0'));
        return `#${r}${g}${b}`.toUpperCase();
    }
    function isHex(value) {
        return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value);
    }
    function resolveHexColor(input, type = 'background') {
        if (!input)
            return null;
        if (isHex(input))
            return input.toUpperCase();
        const base = document.createElement('div');
        base.style.position = 'absolute';
        base.style.visibility = 'hidden';
        document.body.appendChild(base);
        const baseStyles = getComputedStyle(base);
        const temp = document.createElement('div');
        temp.style.position = 'absolute';
        temp.style.visibility = 'hidden';
        temp.className = input;
        document.body.appendChild(temp);
        const styles = getComputedStyle(temp);
        let rgb;
        if (type === 'text') {
            rgb = styles.color !== baseStyles.color ? styles.color : styles.backgroundColor;
        }
        else {
            rgb = styles.backgroundColor;
        }
        document.body.removeChild(base);
        document.body.removeChild(temp);
        return rgbToHex(rgb);
    }
    function tooltip_display(text, target, direction) {
        if (!text || text.trim() === "")
            return;
        clearTimeout(timeout_hide);
        clearTimeout(timeout_show);
        if (visible && current_target === target)
            return;
        current_target = target;
        const imageUrl = target.getAttribute('tooltip_image');
        const bgAttr = target.getAttribute('tooltip-background');
        const textAttr = target.getAttribute('tooltip-color');
        const bgHex = resolveHexColor(bgAttr, 'background');
        const textHex = resolveHexColor(textAttr, 'background');
        let contentHtml = '';
        let subtextOffset = 0;
        if (imageUrl) {
            contentHtml += `<div class="tooltip_image"><img src="${imageUrl}" style="height:64px; vertical-align:middle; margin-bottom:8px; border-radius:4px;"></div>`;
            subtextOffset += 36;
        }
        timeout_show = setTimeout(() => {
            const lines = text.split(/\n|<br\s*\/?>/i);
            contentHtml += lines
                .map((line, index) => {
                if (index === 0)
                    return `<div>${line}</div>`;
                subtextOffset += 9;
                return `<div class="tooltip_subtext">${line}</div>`;
            })
                .join('');
            tooltip.innerHTML = contentHtml;
            if (bgHex) {
                tooltip.style.backgroundColor = bgHex;
                tooltip.style.border = 'none';
            }
            else {
                tooltip.style.backgroundColor = '';
                tooltip.style.border = '';
            }
            tooltip.style.color = textHex;
            tooltip.style.visibility = 'visible';
            tooltip.style.opacity = '0';
            tooltip.classList.add('show');
            requestAnimationFrame(() => {
                const rect = target.getBoundingClientRect();
                const tooltip_rect = tooltip.getBoundingClientRect();
                const left = rect.left + rect.width / 2;
                let top;
                if (direction !== "bottom" && rect.top >= tooltip_rect.height + 24 + subtextOffset) {
                    top = rect.top - tooltip_rect.height - 28 - subtextOffset;
                }
                else {
                    top = rect.bottom + 12;
                }
                tooltip.style.top = `${top}px`;
                tooltip.style.left = `${left}px`;
                tooltip.style.transform = 'translateX(-50%) scale(1)';
                tooltip.style.opacity = '1';
                visible = true;
            });
        }, 100);
    }
    function tooltip_hide() {
        clearTimeout(timeout_show);
        clearTimeout(timeout_hide);
        timeout_hide = setTimeout(() => {
            tooltip.classList.remove('show');
            tooltip.style.visibility = 'hidden';
            tooltip.style.opacity = '0';
            tooltip.style.transform = 'translateX(-50%) scale(0.5)';
            // tooltip.style.backgroundColor = '';
            // tooltip.style.color = '';
            // tooltip.style.border = '';
            visible = false;
            current_target = null;
        }, 0);
    }
    document.body.addEventListener('mouseenter', e => {
        const target = e.target.closest('[tooltip]');
        if (!target)
            return;
        tooltip_display(target.getAttribute('tooltip'), target, target.getAttribute('tooltip-direction'));
    }, true);
    document.body.addEventListener('mouseleave', e => {
        if (e.target.closest('[tooltip]'))
            tooltip_hide();
    }, true);
    document.addEventListener('mousemove', e => {
        if (!e.target.closest('[tooltip]') && !tooltip.contains(e.target))
            tooltip_hide();
    });
    window.addEventListener('scroll', tooltip_hide, true);
    window.addEventListener('resize', tooltip_hide);
});
export {};
