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

    // True when Puter.js has loaded
    puterReady: boolean;

    auth: {
        user: PuterUser | null;
        isAuthenticated: boolean;

        signIn: () => Promise<void>;
        signOut: () => Promise<void>;
        refreshUser: () => Promise<void>;
        checkAuthStatus: () => Promise<void>;
        getUser: () => Promise<PuterUser | null>;
    };

    // Initialize Puter.js
    init: () => void;
}
// ==============================
// Zustand Store
// ==============================

export const usePuterStore = create<PuterStore>((set, get) => {
    // ---------------------------------
    // Helper: Set error and reset auth
    // ---------------------------------
    function setError(msg: string) {
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
    }

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

                // Check if Puter.js is loaded
                if (!puter) {
                    setError("Puter.js not available");
                    return;
                }

                // Start loading
                set({
                    isLoading: true,
                    error: null,
                });

                try {
                    console.log("Starting Puter Sign In...");

                    // Open Puter login popup
                    await puter.auth.signIn();

                    console.log("Sign In successful");

                    // Refresh authentication state
                    await get().auth.checkAuthStatus();
                } catch (err) {
                    console.error("Sign In Error:", err);

                    const msg =
                        err instanceof Error
                            ? err.message
                            : "Sign In Failed";

                    setError(msg);
                } finally {
                    // Stop loading
                    set({
                        isLoading: false,
                    });
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
        puterReady: false,

        // Initialize Puter.js
        // This function waits until Puter.js
        // has loaded before using it.
        // If it loads successfully, we check
        // the user's authentication status.
        // If it doesn't load within 10 seconds,
        // an error is displayed.
        // ==============================
        init: () => {

            // ------------------------------
            // Step 1: Check if Puter.js
            // is already loaded.
            // ------------------------------
            if (getPuter()) {

                // Mark Puter as ready
                set({
                    puterReady: true,
                });

                // Check whether the user
                // is already signed in
                get().auth.checkAuthStatus();

                return;
            }

            // ------------------------------
            // Step 2: If Puter isn't loaded,
            // keep checking every 100ms.
            // ------------------------------
            const interval = setInterval(() => {

                if (getPuter()) {

                    // Stop checking
                    clearInterval(interval);

                    // Mark Puter as ready
                    set({
                        puterReady: true,
                    });

                    // Update authentication state
                    get().auth.checkAuthStatus();
                }

            }, 100);

            // ------------------------------
            // Step 3: Stop checking after
            // 10 seconds.
            // ------------------------------
            setTimeout(() => {

                // Stop the interval
                clearInterval(interval);

                // If Puter still isn't loaded,
                // show an error message.
                if (!getPuter()) {

                    setError(
                        "Puter.js failed to load within 10 seconds"
                    );
                }

            }, 10000);
        },
    };
});

// =======================================
// Store Helper
// =======================================

const setPuterError = (msg: string) => {
    usePuterStore.setState({
        error: msg,
        isLoading: false,
    });
};

// =======================================
// File System Actions
// =======================================

// Write a file
const write = async (
    path: string,
    data: string | File | Blob
): Promise<File | undefined> => {
    const puter = getPuter();

    if (!puter) {
        setPuterError("Puter.js is not available");
        return undefined;
    }

    return await puter.fs.write(path, data);
};

// =======================================
// Read Directory
// =======================================

const readDir = async (
    path: string
): Promise<FSItem[] | undefined> => {
    const puter = getPuter();

    if (!puter) {
        setPuterError("Puter.js is not available");
        return undefined;
    }

    return await puter.fs.readdir(path);
};

// =======================================
// Read File
// =======================================

const readFile = async (
    path: string
): Promise<Blob | undefined> => {
    const puter = getPuter();

    if (!puter) {
        setPuterError("Puter.js is not available");
        return undefined;
    }

    return await puter.fs.read(path);
};

// =======================================
// Upload Files
// =======================================

const upload = async (
    files: File[] | Blob[]
): Promise<FSItem | undefined> => {
    const puter = getPuter();

    if (!puter) {
        setPuterError("Puter.js is not available");
        return;
    }

    return await puter.fs.upload(files);
};

// =======================================
// Delete File
// =======================================

const deleteFile = async (
    path: string
): Promise<void> => {
    const puter = getPuter();

    if (!puter) {
        setPuterError("Puter.js is not available");
        return;
    }

    await puter.fs.delete(path);
};// =======================================
// AI Actions
// =======================================

// Chat with AI
const chat = async (
    prompt: string | ChatMessage[],
    imageURL?: string,
    testMode?: boolean,
    options?: PuterChatOptions
): Promise<AIResponse | undefined> => {
    const puter = getPuter();

    if (!puter) {
        setPuterError("Puter.js is not available");
        return undefined;
    }

    return await puter.ai.chat(
        prompt,
        imageURL,
        testMode,
        options
    );
};

// =======================================
// AI Feedback
// =======================================

const feedback = async (
    path: string,
    message: string
): Promise<AIResponse | undefined> => {
    const puter = getPuter();

    if (!puter) {
        setPuterError("Puter.js is not available");
        return undefined;
    }

    return await puter.ai.chat(
        [
            {
                role: "user",
                content: [
                    {
                        type: "file",
                        puter_path: path,
                    },
                    {
                        type: "text",
                        text: message,
                    },
                ],
            },
        ],
        undefined,
        false,
        {
            model: "claude-sonnet-4",
        }
    );
};

// =======================================
// Image to Text
// =======================================

const img2txt = async (
    image: string | File | Blob,
    testMode?: boolean
): Promise<string | undefined> => {
    const puter = getPuter();

    if (!puter) {
        setPuterError("Puter.js is not available");
        return undefined;
    }

    return await puter.ai.img2txt(image, testMode);
};

// =======================================
// Key-Value Store Actions
// =======================================

// Get
const getKv = async (key: string) => {
    const puter = getPuter();

    if (!puter) {
        setPuterError("Puter.js is not available");
        return undefined;
    }

    return await puter.kv.get(key);
};

// Set
const setKv = async (key: string, value: string) => {
    const puter = getPuter();

    if (!puter) {
        setPuterError("Puter.js is not available");
        return undefined;
    }

    return await puter.kv.set(key, value);
};

// Delete
const deleteKv = async (key: string) => {
    const puter = getPuter();

    if (!puter) {
        setPuterError("Puter.js is not available");
        return undefined;
    }

    return await puter.kv.delete(key);
};

// List
const listKv = async (
    pattern: string,
    returnValues = false
) => {
    const puter = getPuter();

    if (!puter) {
        setPuterError("Puter.js is not available");
        return undefined;
    }

    return await puter.kv.list(pattern, returnValues);
};

// Flush
const flushKv = async () => {
    const puter = getPuter();

    if (!puter) {
        setPuterError("Puter.js is not available");
        return undefined;
    }

    return await puter.kv.flush();
};
