export type Post = {
    content: string,
    author: string,
    title: string
}

export type User = {
    displayName: string | null,
    email: string,
    uid: string,
    photoURL: string | null,
}

export type packageJson = {
    version: string,
    repository: string,
    name: string,
    author: string,
    license: string,
    private: boolean,
    main: string
}