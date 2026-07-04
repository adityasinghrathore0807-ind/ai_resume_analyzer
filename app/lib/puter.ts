// import Zustand for state management
import { create } from "zustand";

// Extend the global window object to include Puter API
declare global {
    interface Window {
        puter: {
            auth: {// Authentication API}
                /* Get our currently  signed in user */
                getUser: () => Promise<PuterUser>
                /* check if a user is signed in */

            }
        }
    }
}
