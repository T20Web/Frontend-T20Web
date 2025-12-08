import { ref, computed } from "vue";
import { setAuthToken, loginApi, registerApi, getMe, logout as apiLogout } from "../api";

const user = ref(JSON.parse(localStorage.getItem("user") || "null"));

function setUser(u) {
    user.value = u;
    if (u) localStorage.setItem("user", JSON.stringify(u));
    else localStorage.removeItem("user");
}

export function useAuth() {
    const isAuthenticated = computed(() => !!user.value);

    async function login(email, password) {
        const data = await loginApi({ email, password });
        if (!data.token) throw new Error("Token não recebido do backend.");
        setAuthToken(data.token);
        setUser(data.user);
        return data.user;
    }

    async function register(name, email, password) {
        const data = await registerApi({ name, email, password });

        if (!data.token) {
            return await login(email, password);
        }

        setAuthToken(data.token);

        if (!data.user) {
            const me = await fetchMe();
            return me;
        } else {
            setUser(data.user);
            return data.user;
        }
    }

    function logout() {
        setAuthToken(null);
        setUser(null);
        apiLogout();
    }

    async function fetchMe() {
        if (!user.value) return null;
        const data = await getMe();
        setUser(data);
        return data;
    }

    return { user, isAuthenticated, login, register, logout, fetchMe };
}
