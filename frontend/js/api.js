/**
 * Shared jQuery AJAX helper for CivicEvents API requests.
 * It adds the JWT bearer header and translates authentication/network errors
 * into consistent user-facing feedback.
 */
(function ($, window) {
    "use strict";

    function forbiddenMessage() {
        if (window.showToast) {
            window.showToast("You do not have permission to perform this action.", "error");
        } else {
            window.alert("Forbidden: you do not have permission.");
        }
    }

    function retryMessage() {
        if (window.showToast) {
            window.showToast("Network error. Please check your connection and try again.", "error");
        } else {
            window.alert("Network error. Please try again.");
        }
    }

    window.apiRequest = function apiRequest(options) {
        var settings = $.extend(true, {}, options);
        var originalError = settings.error;
        var handleAuthError = settings.handleAuthError !== false;
        var token = window.Auth && window.Auth.getToken();
        delete settings.handleAuthError;

        settings.headers = $.extend({}, settings.headers);
        if (token) {
            settings.headers.Authorization = "Bearer " + token;
        }

        settings.error = function (xhr, textStatus, errorThrown) {
            if (xhr.status === 401) {
                if (handleAuthError) {
                    // 401 means the session is no longer valid, so clear all auth data.
                    if (window.Auth) {
                        window.Auth.clearSession();
                    }
                    var inPages = window.location.pathname.replace(/\\/g, "/").includes("/pages/");
                    window.location.replace(inPages ? "login.html?expired=1" : "pages/login.html?expired=1");
                }
            } else if (xhr.status === 403) {
                forbiddenMessage();
            } else if (xhr.status === 0 || textStatus === "timeout") {
                retryMessage();
            }

            if (typeof originalError === "function") {
                originalError(xhr, textStatus, errorThrown);
            }
        };

        return $.ajax(settings);
    };
})(jQuery, window);