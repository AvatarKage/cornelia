class Counter:
    def __init__(self):
        self.applied_icons = 0

    def inc(self, value: int = 1):
        self.applied_icons += value

    def reset(self):
        self.applied_icons = 0

    def get(self):
        return self.applied_icons

counter = Counter()