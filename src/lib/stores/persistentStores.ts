import { writable, type Writable } from 'svelte/store';


// Keys for localStorage
const DATE_STORAGE_KEY = 'date-position';
const GID_STORAGE_KEY = 'selected-gid';

// Helper function to safely get and set localStorage
function safeLocalStorage(): Storage | null {
    if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage;
    }
    return null;
}

// Data validation helper for Date objects
function isValidDate(value: any): value is Date {
    return value instanceof Date && !isNaN(value.getTime());
}

// Persistent store for Date
function createPersistentDateStore(key: string, initialValue: Date): Writable<Date> {
    const localStorage = safeLocalStorage();
    const storedValue = localStorage ? localStorage.getItem(key) : null;
    let parsedValue = initialValue;

    if (storedValue !== null) {
        const dateValue = new Date(storedValue);
        if (isValidDate(dateValue)) {
            parsedValue = dateValue;
        }
    }

    const store = writable<Date>(parsedValue);

    store.subscribe(value => {
        if (localStorage) {
            localStorage.setItem(key, value.toISOString());  // Store date as ISO string
        }
    });

    if (typeof window !== 'undefined') {
        window.addEventListener('storage', (event: StorageEvent) => {
            if (event.key === key) {
                const newValue = event.newValue ? new Date(event.newValue) : initialValue;
                if (isValidDate(newValue)) {
                    store.set(newValue);
                }
            }
        });
    }

    return store;
}

// Persistent store for number or null (used for GID)
function createPersistentStore<T>(key: string, initialValue: T): Writable<T> {
    const localStorage = safeLocalStorage();
    const storedValue = localStorage ? localStorage.getItem(key) : null;
    const store = writable<T>(storedValue !== null ? JSON.parse(storedValue) : initialValue);

    store.subscribe(value => {
        if (localStorage) {
            localStorage.setItem(key, JSON.stringify(value));
        }
    });

    if (typeof window !== 'undefined') {
        window.addEventListener('storage', (event: StorageEvent) => {
            if (event.key === key) {
                store.set(JSON.parse(event.newValue || JSON.stringify(initialValue)));
            }
        });
    }

    return store;
}

// Create the dateSelection store to persist Date objects
export const dateSelection: Writable<Date> = createPersistentDateStore(DATE_STORAGE_KEY, new Date("2023-08-23 22:00:00"));

// Create the selectedGid store to persist number or null
//export const selectedGid: Writable<number | null> = createPersistentStore<number | null>(GID_STORAGE_KEY, 30);
export const selectedGid: Writable<number | null> = createPersistentStore<number | null>(GID_STORAGE_KEY, null);
