import { create } from "zustand";

// ==============================
// Type Definitions
// ==============================

export interface PuterUser {
    id: string;
    name: string;
    email: string;
}

export interface FSItem {
    name: string;
    path: string;
    type: "file" | "folder";
}

export interface ChatMessage {
    role: "user" | "assistant" | "system";
    content:
    | string
    | {
        type: "file" | "text";
        puter_path?: string;
        text?: string;
    }[];
}

export interface AIResponse {
    text: string;
    data?: any;
}

export interface KVItem {
    key: string;
    value: string;
}

export interface PuterChatOptions {
    model?: string;
    temperature?: number;
}

// ==============================
// Extend Window
// ==============================

declare global {
    interface Window {
        puter: {
            // Authentication API
            auth: {
                getUser: () => Promise<PuterUser>;
                isSignedIn: () => Promise<boolean>;
                signIn: () => Promise<void>;
                signOut: () => Promise<void>;
            };

            // File System API
            fs: {
                write: (
                    path: string,
                    data: string | File | Blob
                ) => Promise<File | undefined>;

                read: (path: string) => Promise<Blob>;

                upload: (
                    files: File[] | Blob[]
                ) => Promise<FSItem | undefined>;

                delete: (path: string) => Promise<void>;

                readdir: (
                    path: string
                ) => Promise<FSItem[] | undefined>;
            };

            // AI API
            ai: {
                chat: (
                    prompt: string | ChatMessage[],
                    imageURL?: string,
                    testMode?: boolean,
                    options?: PuterChatOptions
                ) => Promise<AIResponse | undefined>;

                feedback: (
                    path: string,
                    message: string
                ) => Promise<AIResponse | undefined>;

                img2txt: (
                    image: string | File | Blob,
                    testMode?: boolean
                ) => Promise<string | undefined>;
            };

            // Key-Value Store
            kv: {
                get: (
                    key: string
                ) => Promise<string | null | undefined>;

                set: (
                    key: string,
                    value: string
                ) => Promise<boolean | undefined>;

                delete: (
                    key: string
                ) => Promise<boolean | undefined>;

                list: (
                    pattern: string,
                    returnValues?: boolean
                ) => Promise<string[] | KVItem[] | undefined>;

                flush: () => Promise<boolean | undefined>;
            };
        };
    }
}
// ==============================
// Utility Function
// ==============================

export const getPuter = () => {
    if (typeof window === "undefined") return null;
    return window.puter ?? null;
};

// ==============================
// Zustand Store Types
// ==============================

interface PuterStore {
    error: string | null;
    isLoading: boolean;

    auth: {
        user: PuterUser | null;
        isAuthenticated: boolean;

        signIn: () => Promise<void>;
        signOut: () => Promise<void>;
        refreshUser: () => Promise<void>;
        checkAuthStatus: () => Promise<void>;
        getUser: () => Promise<PuterUser | null>;
    };
}

// ==============================
// Zustand Store
// ==============================

export const usePuterStore = create<PuterStore>((set, get) => {
    // Helper: Set error and reset auth state
    const setError = (msg: string) => {
        set({
            error: msg,
            isLoading: false,
            auth: {
                user: null,
                isAuthenticated: false,
                signIn: get().auth.signIn,
                signOut: get().auth.signOut,
                refreshUser: get().auth.refreshUser,
                checkAuthStatus: get().auth.checkAuthStatus,
                getUser: get().auth.getUser,
            },
        });
    };

    return {
        error: null,
        isLoading: false,

        auth: {
            user: null,
            isAuthenticated: false,

            signIn: async () => { },

            signOut: async () => { },

            refreshUser: async () => { },

            checkAuthStatus: async () => { },

            getUser: async () => null,
        },
    };
});

