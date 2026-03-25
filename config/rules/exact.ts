/*
————————————————————————————————————————————————————————————————
These rules only apply to folders whose names exactly match the 
entry. Capitalization is ignored.
————————————————————————————————————————————————————————————————
*/

import colors from "../data/colors.js";

const exact:object = {
    "black": { color: colors.random.black },
    "gray": { color: colors.random.gray },
    "white": { color: colors.random.white },
    "brown": { color: colors.random.brown },
    "red": { color: colors.random.red },
    "orange": { color: colors.random.orange },
    "yellow": { color: colors.random.yellow },
    "green": { color: colors.random.green },
    "cyan": { color: colors.random.cyan },
    "blue": { color: colors.random.blue },
    "purple": { color: colors.random.purple },
    "pink": { color: colors.random.pink }   
}

export default exact;