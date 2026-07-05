import { setDefaultResultOrder } from "dns";
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
    // ---------------------------------
    // Helper: Set error and reset auth
    // ---------------------------------
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
        // Initial store state
        error: null,
        isLoading: false,

        auth: {
            user: null,
            isAuthenticated: false,

            // ============================
            // Sign In
            // ============================
            signIn: async () => {
                const puter = getPuter();

                if (!puter) {
                    setError("Puter.js not available");
                    return;
                }

                set({
                    isLoading: true,
                    error: null,
                });

                try {
                    await puter.auth.signIn();

                    // Refresh auth state
                    await get().auth.checkAuthStatus();
                } catch (err) {
                    const msg =
                        err instanceof Error
                            ? err.message
                            : "Sign In Failed";

                    setError(msg);
                }
            },

            // ============================
            // Sign Out
            // ============================
            signOut: async () => {
                const puter = getPuter();

                if (!puter) {
                    setError("Puter.js not available");
                    return;
                }

                set({
                    isLoading: true,
                    error: null,
                });

                try {
                    await puter.auth.signOut();

                    set({
                        auth: {
                            user: null,
                            isAuthenticated: false,
                            signIn: get().auth.signIn,
                            signOut: get().auth.signOut,
                            refreshUser: get().auth.refreshUser,
                            checkAuthStatus: get().auth.checkAuthStatus,
                            getUser: get().auth.getUser,
                        },
                        isLoading: false,
                    });
                } catch (err) {
                    const msg =
                        err instanceof Error
                            ? err.message
                            : "Sign Out Failed";

                    setError(msg);
                }
            },

            // ============================
            // Refresh Current User
            // ============================
            refreshUser: async () => {
                const puter = getPuter();

                if (!puter) {
                    setError("Puter.js not available");
                    return;
                }

                set({
                    isLoading: true,
                    error: null,
                });

                try {
                    const user = await puter.auth.getUser();

                    set({
                        auth: {
                            user,
                            isAuthenticated: true,
                            signIn: get().auth.signIn,
                            signOut: get().auth.signOut,
                            refreshUser: get().auth.refreshUser,
                            checkAuthStatus: get().auth.checkAuthStatus,
                            getUser: get().auth.getUser,
                        },
                        isLoading: false,
                    });
                } catch (err) {
                    const msg =
                        err instanceof Error
                            ? err.message
                            : "Failed to Refresh User";

                    setError(msg);
                }
            },

            // ============================
            // Check Authentication Status
            // ============================
            checkAuthStatus: async () => {
                const puter = getPuter();

                if (!puter) {
                    setError("Puter.js not available");
                    return;
                }

                set({
                    isLoading: true,
                    error: null,
                });

                try {
                    const isSignedIn = await puter.auth.isSignedIn();

                    if (isSignedIn) {
                        const user = await puter.auth.getUser();

                        set({
                            auth: {
                                user,
                                isAuthenticated: true,
                                signIn: get().auth.signIn,
                                signOut: get().auth.signOut,
                                refreshUser: get().auth.refreshUser,
                                checkAuthStatus: get().auth.checkAuthStatus,
                                getUser: get().auth.getUser,
                            },
                            isLoading: false,
                        });

                        return;
                    }

                    set({
                        auth: {
                            user: null,
                            isAuthenticated: false,
                            signIn: get().auth.signIn,
                            signOut: get().auth.signOut,
                            refreshUser: get().auth.refreshUser,
                            checkAuthStatus: get().auth.checkAuthStatus,
                            getUser: get().auth.getUser,
                        },
                        isLoading: false,
                    });
                } catch (err) {
                    const msg =
                        err instanceof Error
                            ? err.message
                            : "Failed to check auth status";

                    setError(msg);
                }
            },

            // ============================
            // Get Current User
            // ============================
            getUser: async () => {
                const puter = getPuter();

                if (!puter) return null;

                return await puter.auth.getUser();
            },
        },
    };
});
// ==============================
// Initialize Puter.js
// Wait until Puter.js is available
// Timeout after 10 seconds
// ==============================

const init = (): void => {
    // If Puter.js is already loaded
    if (getPuter()) {
        set({ puterReady: true });
        get().auth.checkAuthStatus();
        return;
    }

    // Check every 100ms until Puter.js loads
    const interval = setInterval(() => {
        if (getPuter()) {
            clearInterval(interval);

            set({
                puterReady: true,
            });

            get().auth.checkAuthStatus();
        }
    }, 100);

    // Stop checking after 10 seconds
    setTimeout(() => {
        clearInterval(interval);

        if (!getPuter()) {
            setError("Puter.js failed to load within 10 seconds");
        }
    }, 10000);
};
