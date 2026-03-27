/*
————————————————————————————————————————————————————————————————
These rules only apply to folders whose names exactly match the 
entry. Capitalization is ignored.
————————————————————————————————————————————————————————————————
*/

import colors from "../data/colors.js";

const exact:object = {
    "black": { baseColor: colors.random.black },
    "gray": { baseColor: colors.random.gray },
    "white": { baseColor: colors.random.white },
    "brown": { baseColor: colors.random.brown },
    "red": { baseColor: colors.random.red },
    "orange": { baseColor: colors.random.orange },
    "yellow": { baseColor: colors.random.yellow },
    "green": { baseColor: colors.random.green },
    "cyan": { baseColor: colors.random.cyan },
    "blue": { baseColor: colors.random.blue },
    "purple": { baseColor: colors.random.purple },
    "pink": { baseColor: colors.random.pink }   
}

export default exact;