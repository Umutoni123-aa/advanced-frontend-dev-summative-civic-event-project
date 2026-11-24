/**
 * Shared CivicEvents navbar and footer.
 * layout.js also defines window.showToast for success and error messages.
 */
(function ($, window) {
    "use strict";

    function basePath() {
        return window.location.pathname.replace(/\\/g, "/").includes("/pages/")
            ? "../"
            : "";
    }

    function showToast(message, type) {
        if ($("#toast-container").length === 0) {
            $("body").append('<div id="toast-container" aria-live="polite" aria-atomic="true"></div>');
        }
        var success = type === "success";
        var tone = success
            ? "border-green-500 bg-green-50 text-green-900"
            : "border-red-500 bg-red-50 text-red-900";
        var label = success ? "Success" : "Error";

        var $toast = $("<div>", {
            role: "status",
            "aria-live": "polite",
            "aria-label": label + ": " + message,
            class: "fixed bottom-4 right-4 z-50 max-w-sm rounded-lg border-l-4 px-4 py-3 shadow-lg " + tone
        }).text(message);

        $("#toast-container").append($toast);
        setTimeout(function () {
            $toast.fadeOut(250, function () {
                $toast.remove();
            });
        }, 4000);
    }

    window.showToast = showToast;

    $(function () {
        var base = basePath();
        var user = window.Auth && window.Auth.getUser();
        var isAdmin = user && user.role === "admin";
        var isLoggedIn = Boolean(user && window.Auth.getToken());

        // Admin links are rendered only for a confirmed admin session.
        var adminLinks = isAdmin
            ? '<a href="' + base + 'pages/dashboard.html" role="menuitem" class="block px-4 py-2 text-sm hover:bg-slate-100">Admin Dashboard</a>'
              + '<a href="' + base + 'pages/events.html?mode=manage" role="menuitem" class="block px-4 py-2 text-sm hover:bg-slate-100">Manage Events</a>'
            : "";

        var accountLinks = isLoggedIn
            ? '<a href="' + base + 'pages/dashboard.html" role="menuitem" class="block px-4 py-2 text-sm hover:bg-slate-100">Dashboard</a>'
              + '<button type="button" id="logout-button" role="menuitem" class="w-full px-4 py-2 text-left text-sm hover:bg-slate-100">Log out</button>'
            : '<a href="' + base + 'pages/login.html" role="menuitem" class="block px-4 py-2 text-sm hover:bg-slate-100">Log in</a>'
              + '<a href="' + base + 'pages/signup.html" role="menuitem" class="block px-4 py-2 text-sm hover:bg-slate-100">Sign up</a>';

        $("#site-navbar").html(
            '<nav class="bg-blue-900 text-white shadow" aria-label="Main navigation">'
            + '<div class="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">'
            + '<a class="flex items-center text-lg font-bold" href="' + base + 'index.html" aria-label="CivicEvents home">'
            + '<span class="mr-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-blue-950" aria-hidden="true">CE</span>CivicEvents</a>'
            + '<form id="nav-search-form" class="order-last w-full sm:order-none sm:ml-auto sm:w-64" role="search">'
            + '<label class="sr-only" for="nav-search">Search civic events</label>'
            + '<input id="nav-search" name="q" type="search" placeholder="Search events" class="w-full rounded-md px-3 py-2 text-slate-900" />'
            + '</form>'
            + '<div class="ml-auto flex items-center gap-1 sm:ml-0">'
            + '<a href="' + base + 'pages/events.html" class="rounded px-3 py-2 text-sm hover:bg-blue-800">Events</a>'
            + '<a href="' + base + 'pages/events.html#announcements" class="hidden rounded px-3 py-2 text-sm hover:bg-blue-800 md:inline">Announcements</a>'
            + '<a href="' + base + 'pages/events.html#promos" class="hidden rounded px-3 py-2 text-sm hover:bg-blue-800 md:inline">Promos</a>'
            + '<button type="button" class="relative rounded p-2 hover:bg-blue-800" aria-label="Notifications, 3 unread">'
            + '<span aria-hidden="true">&#128276;</span><span class="absolute -right-1 -top-1 rounded-full bg-red-600 px-1.5 text-xs" aria-hidden="true">3</span>'
            + '</button>'
            + '<div class="relative">'
            + '<button id="profile-menu-button" type="button" class="rounded px-3 py-2 hover:bg-blue-800" aria-haspopup="menu" aria-expanded="false">'
            + (isLoggedIn ? (user.full_name || "Profile") : "Account") + '</button>'
            + '<div id="profile-menu" class="absolute right-0 z-40 hidden min-w-44 rounded border bg-white text-slate-900 shadow-lg" role="menu">'
            + adminLinks + accountLinks
            + '</div></div></div></div></nav>'
        );

        $("#profile-menu-button").on("click", function () {
            var $menu = $("#profile-menu");
            var isExpanded = $(this).attr("aria-expanded") === "true";
            $(this).attr("aria-expanded", String(!isExpanded));
            $menu.toggleClass("hidden", isExpanded);
        });

        $(document).on("click", "#logout-button", function () {
            window.Auth.clearSession();
            window.location.replace(base + "pages/login.html");
        });

        $("#nav-search-form").on("submit", function (event) {
            event.preventDefault();
            var query = $.trim($("#nav-search").val());
            window.location.href = base + "pages/events.html" + (query ? "?q=" + encodeURIComponent(query) : "");
        });

        $("#site-footer").html(
            '<footer class="mt-auto border-t bg-slate-100" aria-label="Footer">'
            + '<div class="mx-auto max-w-7xl px-4 py-8 text-sm text-slate-700">'
            + '<div class="grid gap-6 sm:grid-cols-3">'
            + '<section><h2 class="font-semibold text-slate-900">CivicEvents</h2><p>Stay informed about events in your city.</p></section>'
            + '<section><h2 class="font-semibold text-slate-900">Contact</h2><p>Email: <a class="underline" href="mailto:help@civicevents.local">help@civicevents.local</a></p></section>'
            + '<section><h2 class="font-semibold text-slate-900">Help</h2><p><a class="underline" href="' + base + 'pages/events.html">Browse events</a> or contact our support team.</p></section>'
            + '</div><p class="mt-6 text-xs">&copy; ' + new Date().getFullYear() + " CivicEvents</p>"
            + '</div></footer>'
        );

        if ($("#toast-container").length === 0) {
            $("body").append('<div id="toast-container" aria-live="polite" aria-atomic="true"></div>');
        }
    });
})(jQuery, window);
