import os

from src.cornelia.scripts.helpers.should_watch import should_watch

def count_dirs(path):
    total = 0

    for root, dirs, files in os.walk(path, followlinks=False):
        dirs[:] = [
            d for d in dirs
            if should_watch(os.path.join(root, d))
        ]
        total += len(dirs)
    return total