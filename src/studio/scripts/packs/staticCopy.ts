const staticCopy = [
    {
        toml: {
            priority: "0",
            id: "official",
            version: "2.0.0",
            icon: "",
            name: "Official Folder Pack",
            description: "Adds popular icons and brands for everyday use.",
            author: "AvatarKage",
            min_app_version: "2.0.0-beta",
            min_studio_version: "1.0.0-beta",
            dependencies: [""]
        },

        content: {
            assets: {
                folders: {
                    flat: {
                        center1: {
                            path: "userdata/packs/official/assets/folders/flat/center1.svg",
                            name: "Center 1",
                            content: async () =>
                                fetch("userdata/packs/official/assets/folders/flat/center1.svg").then(r => r.text())
                        },
                        center2: {
                            path: "userdata/packs/official/assets/folders/flat/center2.svg",
                            name: "Center 2",
                            content: async () =>
                                fetch("userdata/packs/official/assets/folders/flat/center2.svg").then(r => r.text())
                        },
                        center3: {
                            path: "userdata/packs/official/assets/folders/flat/center3.svg",
                            name: "Center 3",
                            content: async () =>
                                fetch("userdata/packs/official/assets/folders/flat/center3.svg").then(r => r.text())
                        },

                        left1: {
                            path: "userdata/packs/official/assets/folders/flat/left1.svg",
                            name: "Left 1",
                            content: async () =>
                                fetch("userdata/packs/official/assets/folders/flat/left1.svg").then(r => r.text())
                        },
                        left2: {
                            path: "userdata/packs/official/assets/folders/flat/left2.svg",
                            name: "Left 2",
                            content: async () =>
                                fetch("userdata/packs/official/assets/folders/flat/left2.svg").then(r => r.text())
                        },
                        left3: {
                            path: "userdata/packs/official/assets/folders/flat/left3.svg",
                            name: "Left 3",
                            content: async () =>
                                fetch("userdata/packs/official/assets/folders/flat/left3.svg").then(r => r.text())
                        },

                        right1: {
                            path: "userdata/packs/official/assets/folders/flat/right1.svg",
                            name: "Right 1",
                            content: async () =>
                                fetch("userdata/packs/official/assets/folders/flat/right1.svg").then(r => r.text())
                        },
                        right2: {
                            path: "userdata/packs/official/assets/folders/flat/right2.svg",
                            name: "Right 2",
                            content: async () =>
                                fetch("userdata/packs/official/assets/folders/flat/right2.svg").then(r => r.text())
                        },
                        right3: {
                            path: "userdata/packs/official/assets/folders/flat/right3.svg",
                            name: "Right 3",
                            content: async () =>
                                fetch("userdata/packs/official/assets/folders/flat/right3.svg").then(r => r.text())
                        }
                    },

                    outline: {
                        center1: {
                            path: "userdata/packs/official/assets/folders/outline/center1.svg",
                            name: "Center 1",
                            content: async () =>
                                fetch("userdata/packs/official/assets/folders/outline/center1.svg").then(r => r.text())
                        },
                        center2: {
                            path: "userdata/packs/official/assets/folders/outline/center2.svg",
                            name: "Center 2",
                            content: async () =>
                                fetch("userdata/packs/official/assets/folders/outline/center2.svg").then(r => r.text())
                        },
                        center3: {
                            path: "userdata/packs/official/assets/folders/outline/center3.svg",
                            name: "Center 3",
                            content: async () =>
                                fetch("userdata/packs/official/assets/folders/outline/center3.svg").then(r => r.text())
                        },

                        left1: {
                            path: "userdata/packs/official/assets/folders/outline/left1.svg",
                            name: "Left 1",
                            content: async () =>
                                fetch("userdata/packs/official/assets/folders/outline/left1.svg").then(r => r.text())
                        },
                        left2: {
                            path: "userdata/packs/official/assets/folders/outline/left2.svg",
                            name: "Left 2",
                            content: async () =>
                                fetch("userdata/packs/official/assets/folders/outline/left2.svg").then(r => r.text())
                        },
                        left3: {
                            path: "userdata/packs/official/assets/folders/outline/left3.svg",
                            name: "Left 3",
                            content: async () =>
                                fetch("userdata/packs/official/assets/folders/outline/left3.svg").then(r => r.text())
                        },

                        right1: {
                            path: "userdata/packs/official/assets/folders/outline/right1.svg",
                            name: "Right 1",
                            content: async () =>
                                fetch("userdata/packs/official/assets/folders/outline/right1.svg").then(r => r.text())
                        },
                        right2: {
                            path: "userdata/packs/official/assets/folders/outline/right2.svg",
                            name: "Right 2",
                            content: async () =>
                                fetch("userdata/packs/official/assets/folders/outline/right2.svg").then(r => r.text())
                        },
                        right3: {
                            path: "userdata/packs/official/assets/folders/outline/right3.svg",
                            name: "Right 3",
                            content: async () =>
                                fetch("userdata/packs/official/assets/folders/outline/right3.svg").then(r => r.text())
                        }
                    },

                    shaded: {
                        center1: {
                            path: "userdata/packs/official/assets/folders/shaded/center1.svg",
                            name: "Center 1",
                            content: async () =>
                                fetch("userdata/packs/official/assets/folders/shaded/center1.svg").then(r => r.text())
                        },
                        center2: {
                            path: "userdata/packs/official/assets/folders/shaded/center2.svg",
                            name: "Center 2",
                            content: async () =>
                                fetch("userdata/packs/official/assets/folders/shaded/center2.svg").then(r => r.text())
                        },
                        center3: {
                            path: "userdata/packs/official/assets/folders/shaded/center3.svg",
                            name: "Center 3",
                            content: async () =>
                                fetch("userdata/packs/official/assets/folders/shaded/center3.svg").then(r => r.text())
                        },

                        left1: {
                            path: "userdata/packs/official/assets/folders/shaded/left1.svg",
                            name: "Left 1",
                            content: async () =>
                                fetch("userdata/packs/official/assets/folders/shaded/left1.svg").then(r => r.text())
                        },
                        left2: {
                            path: "userdata/packs/official/assets/folders/shaded/left2.svg",
                            name: "Left 2",
                            content: async () =>
                                fetch("userdata/packs/official/assets/folders/shaded/left2.svg").then(r => r.text())
                        },
                        left3: {
                            path: "userdata/packs/official/assets/folders/shaded/left3.svg",
                            name: "Left 3",
                            content: async () =>
                                fetch("userdata/packs/official/assets/folders/shaded/left3.svg").then(r => r.text())
                        },

                        right1: {
                            path: "userdata/packs/official/assets/folders/shaded/right1.svg",
                            name: "Right 1",
                            content: async () =>
                                fetch("userdata/packs/official/assets/folders/shaded/right1.svg").then(r => r.text())
                        },
                        right2: {
                            path: "userdata/packs/official/assets/folders/shaded/right2.svg",
                            name: "Right 2",
                            content: async () =>
                                fetch("userdata/packs/official/assets/folders/shaded/right2.svg").then(r => r.text())
                        },
                        right3: {
                            path: "userdata/packs/official/assets/folders/shaded/right3.svg",
                            name: "Right 3",
                            content: async () =>
                                fetch("userdata/packs/official/assets/folders/shaded/right3.svg").then(r => r.text())
                        }
                    }
                },

                fonts: {
                    "jetbrains-nerdfont": {
                        path: "userdata/packs/official/assets/fonts/jetbrains-nerdfont.ttf",
                        name: "JetBrains Mono",
                        content: "userdata/packs/official/assets/fonts/jetbrains-nerdfont.ttf"
                    },

                    "playwrite-cursive": {
                        path: "userdata/packs/official/assets/fonts/playwrite-cursive.ttf",
                        name: "Playwrite Perú",
                        content: "userdata/packs/official/assets/fonts/playwrite-cursive.ttf"
                    },

                    "playwrite-nerdfont": {
                        path: "userdata/packs/official/assets/fonts/playwrite-nerdfont.ttf",
                        name: "Playwrite Deutschland Grundschrift",
                        content: "userdata/packs/official/assets/fonts/playwrite-nerdfont.ttf"
                    },
                    "comicshanns-nerdfont": {
                        path: "userdata/packs/official/assets/fonts/comicshanns-nerdfont.ttf",
                        name: "Comic Shanns",
                        content: "userdata/packs/official/assets/fonts/comicshanns-nerdfont.ttf"
                    },

                    "departure-nerdfont": {
                        path: "userdata/packs/official/assets/fonts/departure-nerdfont.ttf",
                        name: "Departure",
                        content: "userdata/packs/official/assets/fonts/departure-nerdfont.ttf"
                    },

                    "heavydata-nerdfont": {
                        path: "userdata/packs/official/assets/fonts/heavydata-nerdfont.ttf",
                        name: "Heavy Data",
                        content: "userdata/packs/official/assets/fonts/heavydata-nerdfont.ttf"
                    }
                }
            }
        }
    }
];

export default staticCopy;