/**
 * Authentication helpers for CivicEvents.
 *
 * The token and user are kept in sessionStorage for a normal session, or
 * localStorage when "Remember me" was selected during login.
 * Keep token and user storage in sync so that one source of truth is used.
 */
(function (window) {
    "use strict";

    var TOKEN_KEY = "civicEventsToken";
    var USER_KEY = "civicEventsUser";

    function getRememberPreference() {
        return localStorage.getItem("civicEventsRememberMe") === "true";
    }

    function getStorage(rememberMe) {
        return rememberMe ? localStorage : sessionStorage;
    }

    function saveSession(token, user, rememberMe) {
        var persistent = getStorage(Boolean(rememberMe));
        var other = rememberMe ? sessionStorage : localStorage;

        // Remove stale values from the other storage before writing.
        other.removeItem(TOKEN_KEY);
        other.removeItem(USER_KEY);

        localStorage.removeItem("civicEventsRememberMe");
        if (rememberMe) {
            localStorage.setItem("civicEventsRememberMe", "true");
        }

        persistent.setItem(TOKEN_KEY, token);
        persistent.setItem(USER_KEY, JSON.stringify(user));
    }

    function getToken() {
        return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
    }

    function getUser() {
        var raw = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);

        if (!raw) {
            return null;
        }

        try {
            return JSON.parse(raw);
        } catch (error) {
            clearSession();
            return null;
        }
    }

    function clearSession() {
        [localStorage, sessionStorage].forEach(function (storage) {
            storage.removeItem(TOKEN_KEY);
            storage.removeItem(USER_KEY);
        });
        localStorage.removeItem("civicEventsRememberMe");
    }

    function loginUrl() {
        var isPagesDirectory = window.location.pathname.replace(/\\/g, "/").includes("/pages/");
        return isPagesDirectory ? "login.html" : "pages/login.html";
    }

    // Protects pages that require any logged-in user.
    function requireLogin() {
        if (!getToken()) {
            window.location.replace(loginUrl());
            return false;
        }
        return true;
    }

    // Protects admin-only pages. Ordinary users are sent to the events page.
    function requireAdmin() {
        if (!requireLogin()) {
            return false;
        }

        var user = getUser();
        if (!user || user.role !== "admin") {
            window.location.replace(window.location.pathname.replace(/\\/g, "/").includes("/pages/")
                ? "events.html"
                : "pages/events.html");
            return false;
        }
        return true;
    }

    window.Auth = {
        saveSession: saveSession,
        getToken: getToken,
        getUser: getUser,
        clearSession: clearSession,
        requireLogin: requireLogin,
        requireAdmin: requireAdmin,
        getRememberPreference: getRememberPreference
    };
})(window);