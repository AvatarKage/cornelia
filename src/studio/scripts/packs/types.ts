type PackToml = {
    id: string;
    min_studio_version: string;
    priority?: number;
    [key: string]: unknown;
};

type LazyContent<T = unknown> =
    | string
    | (() => Promise<T>);

type FileEntry<T = unknown> = {
    path: string;
    name: string;
    content: LazyContent<T>;
};

type FileTree<T = unknown> = {
    [key: string]: FileTree<T> | FileEntry<T>;
};

type LangTree = Record<string, Record<string, unknown>>;

type Pack<T = unknown> = {
    toml: PackToml;
    content: FileTree<T>;
    lang: LangTree;

    get: <R = unknown>(path: string) => Promise<R>;
};

export type {
    PackToml,
    LazyContent,
    FileEntry,
    FileTree,
    LangTree,
    Pack
}