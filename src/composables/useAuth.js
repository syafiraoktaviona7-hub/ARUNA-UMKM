import { reactive, computed } from "vue";

const STORAGE_KEY = "aruna_auth";
const ACCOUNTS_KEY = "aruna_accounts";

// Akun admin bawaan
const ADMIN_ACCOUNTS = [{
    id: 1,
    name: "Admin ARUNA",
    email: "admin@aruna.id",
    password: "admin123",
    role: "admin",
}, ];

// =========================
// LOAD USER YANG SEDANG LOGIN
// =========================
function loadUser() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

// =========================
// LOAD SEMUA AKUN TERDAFTAR
// =========================
function loadAccounts() {
    try {
        const raw = localStorage.getItem(ACCOUNTS_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

// State login dibuat bersama agar bisa dipakai semua komponen
const state = reactive({
    user: loadUser(),
});

export function useAuth() {
    const user = computed(() => state.user);

    const isLoggedIn = computed(() => !!state.user);

    const isAdmin = computed(() => {
        return state.user && state.user.role === "admin";
    });

    // =========================
    // REGISTER
    // =========================
    function registerUser(accountData) {
        const accounts = loadAccounts();

        const email = accountData.email.trim().toLowerCase();

        // Cek email sudah terdaftar atau belum
        const emailExists =
            ADMIN_ACCOUNTS.some(
                (account) => account.email === email
            ) ||
            accounts.some(
                (account) => account.email === email
            );

        if (emailExists) {
            throw new Error("Email sudah terdaftar.");
        }

        // Simpan seluruh data yang dikirim dari halaman register
        const newAccount = {
            id: Date.now(),
            ...accountData,
            email: email,
            namaToko: accountData.namaToko || "",
        };

        accounts.push(newAccount);

        localStorage.setItem(
            ACCOUNTS_KEY,
            JSON.stringify(accounts)
        );

        return newAccount;
    }

    // =========================
    // LOGIN
    // =========================
    async function login(email, password) {
        await new Promise((resolve) =>
            setTimeout(resolve, 600)
        );

        const normalizedEmail = email.trim().toLowerCase();

        // Cek akun admin
        const adminAccount = ADMIN_ACCOUNTS.find(
            (account) =>
            account.email === normalizedEmail &&
            account.password === password
        );

        // Cek akun customer / penjual
        const accounts = loadAccounts();

        const registeredAccount = accounts.find(
            (account) =>
            account.email === normalizedEmail &&
            account.password === password
        );

        const account =
            adminAccount || registeredAccount;

        if (!account) {
            throw new Error(
                "Email atau kata sandi salah."
            );
        }

        // Jangan simpan password ke state login
        const {
            password: _password,
            ...safeUser
        } = account;

        state.user = safeUser;

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(safeUser)
        );

        return safeUser;
    }

    // Tetap disediakan supaya kode lama yang memakai loginAdmin tidak rusak
    async function loginAdmin(email, password) {
        return login(email, password);
    }

    // =========================
    // UPDATE USER / EDIT PROFIL
    // =========================
    function updateUser(updates) {
        const currentUser = state.user;

        if (!currentUser) {
            throw new Error(
                "Tidak ada pengguna yang sedang login."
            );
        }

        const accounts = loadAccounts();

        // Cari akun berdasarkan ID user yang sedang login
        const accountIndex = accounts.findIndex(
            (account) =>
            account.id === currentUser.id
        );

        if (accountIndex === -1) {
            throw new Error(
                "Data akun tidak ditemukan."
            );
        }

        // =========================
        // CEK EMAIL
        // =========================
        const newEmail =
            updates.email &&
            updates.email.trim() ?
            updates.email.trim().toLowerCase() :
            accounts[accountIndex].email;

        // Kalau email diganti, cek apakah sudah dipakai akun lain
        if (
            newEmail !==
            accounts[accountIndex].email
        ) {
            const emailExists =
                ADMIN_ACCOUNTS.some(
                    (account) =>
                    account.email === newEmail
                ) ||
                accounts.some(
                    (account, index) =>
                    index !== accountIndex &&
                    account.email === newEmail
                );

            if (emailExists) {
                throw new Error(
                    "Email sudah digunakan oleh akun lain."
                );
            }
        }

        // =========================
        // GABUNG DATA LAMA + DATA BARU
        // =========================
        const updatedAccount = {
            ...accounts[accountIndex],
            ...updates,
            email: newEmail,
        };

        // Update akun di daftar accounts
        accounts[accountIndex] = updatedAccount;

        // Simpan kembali semua akun
        localStorage.setItem(
            ACCOUNTS_KEY,
            JSON.stringify(accounts)
        );

        // =========================
        // UPDATE USER YANG SEDANG LOGIN
        // =========================

        // Jangan simpan password ke state login
        const {
            password: _password,
            ...safeUser
        } = updatedAccount;

        // Update reactive state
        state.user = safeUser;

        // Update localStorage user aktif
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(safeUser)
        );

        return safeUser;
    }

    // =========================
    // LOGOUT
    // =========================
    function logout() {
        state.user = null;

        localStorage.removeItem(
            STORAGE_KEY
        );
    }

    return {
        user,
        isLoggedIn,
        isAdmin,

        registerUser,

        login,
        loginAdmin,

        updateUser,

        logout,
    };
}