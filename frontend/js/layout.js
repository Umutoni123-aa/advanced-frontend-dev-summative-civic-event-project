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
              + '<a href="' + base + 'pages/event-create.html" role="menuitem" class="block px-4 py-2 text-sm hover:bg-slate-100">Create Event</a>'
              + '<a href="' + base + 'pages/events.html?mode=manage" role="menuitem" class="block px-4 py-2 text-sm hover:bg-slate-100">Manage Events</a>'
            : "";

        var accountLinks = isLoggedIn
            ? '<a href="' + base + 'pages/profile.html" role="menuitem" class="block px-4 py-2 text-sm hover:bg-slate-100">Profile</a>'
              + (isAdmin ? '<a href="' + base + 'pages/dashboard.html" role="menuitem" class="block px-4 py-2 text-sm hover:bg-slate-100">Dashboard</a>' : "")
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
            + '<a href="' + base + 'pages/announcements.html" class="hidden rounded px-3 py-2 text-sm hover:bg-blue-800 md:inline">Announcements</a>'
            + '<a href="' + base + 'pages/promos.html" class="hidden rounded px-3 py-2 text-sm hover:bg-blue-800 md:inline">Promos</a>'
            + '<button id="notification-button" type="button" class="relative rounded p-2 hover:bg-blue-800" aria-label="Notifications" aria-haspopup="dialog" aria-expanded="false">'
            + '<span aria-hidden="true">&#128276;</span><span id="notification-count" class="absolute -right-1 -top-1 hidden rounded-full bg-red-600 px-1.5 text-xs" aria-hidden="true">0</span>'
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

        if ($("#notification-drawer").length === 0) {
            $("body").append(
                '<aside id="notification-drawer" class="fixed right-0 top-0 z-[60] hidden h-full w-full max-w-md overflow-y-auto bg-white shadow-xl" role="dialog" aria-modal="true" aria-labelledby="notification-heading">' +
                '<div class="sticky top-0 flex items-center justify-between border-b bg-white px-4 py-3"><h2 id="notification-heading" class="text-lg font-bold">Notifications</h2>' +
                '<button id="notification-close" type="button" class="rounded p-2 text-sm font-semibold hover:bg-slate-100" aria-label="Close notifications">Close</button></div>' +
                '<div id="notification-admin-create" class="hidden border-b p-4"><button id="notification-create-toggle" type="button" class="rounded-md border border-blue-800 px-3 py-2 text-sm font-semibold text-blue-800">Create broadcast notification</button>' +
                '<form id="notification-create-form" class="mt-3 hidden space-y-3" novalidate><label for="notification-title" class="block text-sm font-semibold">Title</label><input id="notification-title" type="text" required class="w-full rounded border border-slate-300 px-3 py-2">' +
                '<label for="notification-message" class="block text-sm font-semibold">Message</label><textarea id="notification-message" rows="3" required class="w-full rounded border border-slate-300 px-3 py-2"></textarea>' +
                '<button type="submit" class="rounded-md bg-blue-800 px-4 py-2 text-sm font-semibold text-white">Create broadcast</button></form></div>' +
                '<p id="notification-status" class="sr-only" aria-live="polite"></p><div id="notification-list" class="divide-y"></div></aside>'
            );
        }

        if (isLoggedIn) {
            apiRequest({
                url: BASE_URL + "/api/notifications",
                method: "GET",
                success: function (response) {
                    var notifications = Array.isArray(response.data) ? response.data : [];
                    var locallyRead = JSON.parse(localStorage.getItem("civicEventsReadNotifications") || "[]");
                    var unread = notifications.filter(function (item) {
                        return !item.read && locallyRead.indexOf(item.id) === -1;
                    }).length;
                    var $count = $("#notification-count");
                    $count.text(unread).toggleClass("hidden", unread === 0);
                    $("#notification-button").attr("aria-label", "Notifications, " + unread + " unread");
                }
            });

            if (isAdmin) $("#notification-admin-create").removeClass("hidden");
        }

        $(document).on("click", "#notification-button", function () {
            var $drawer = $("#notification-drawer");
            $drawer.removeClass("hidden");
            $(this).attr("aria-expanded", "true");
            loadNotifications();
            $("#notification-close").trigger("focus");
        });
        $(document).on("click", "#notification-close", function () {
            $("#notification-drawer").addClass("hidden");
            $("#notification-button").attr("aria-expanded", "false").trigger("focus");
        });
        $(document).on("click", "#notification-create-toggle", function () {
            $("#notification-create-form").toggleClass("hidden");
        });

        window.loadNotifications = function loadNotifications() {
            apiRequest({
                url: BASE_URL + "/api/notifications",
                method: "GET",
                success: function (response) {
                    var notifications = Array.isArray(response.data) ? response.data : [];
                    var locallyRead = JSON.parse(localStorage.getItem("civicEventsReadNotifications") || "[]");
                    $("#notification-list").empty();

                    if (!notifications.length) {
                        $("#notification-list").html('<p class="p-6 text-center text-sm text-slate-600">No notifications.</p>');
                        $("#notification-status").text("No notifications.");
                        return;
                    }

                    notifications.forEach(function (notification) {
                        var isRead = notification.read || locallyRead.indexOf(notification.id) !== -1;
                        var eventId = notification.metadata && notification.metadata.event_id;
                        var eventLink = eventId
                            ? '<a href="' + base + 'pages/event-detail.html?id=' + encodeURIComponent(eventId) + '" data-notification-read="' + escapeNotification(notification.id) + '" class="mt-3 inline-block text-sm font-semibold text-blue-800 underline">View related event</a>'
                            : "";
                        var deleteButton = isAdmin
                            ? '<button type="button" data-delete-notification="' + escapeNotification(notification.id) + '" class="rounded border border-red-600 px-2 py-1 text-xs font-semibold text-red-700">Delete</button>'
                            : "";
                        $("#notification-list").append(
                            '<article class="p-4" data-notification-id="' + escapeNotification(notification.id) + '">' +
                            '<div class="flex items-start justify-between gap-3"><div><h3 class="font-bold">' + escapeNotification(notification.title) + '</h3><p class="mt-1 text-sm text-slate-700">' + escapeNotification(notification.message) + '</p></div>' +
                            '<span class="rounded-full px-2 py-1 text-xs ' + (isRead ? "bg-slate-100 text-slate-600" : "bg-blue-100 text-blue-900") + '">' + (isRead ? "Read" : "Unread") + '</span></div>' +
                            eventLink + '<div class="mt-3 flex items-center justify-between gap-2"><button type="button" data-notification-read="' + escapeNotification(notification.id) + '" class="text-xs font-semibold text-blue-800 underline" ' + (isRead ? "disabled" : "") + '>Mark as read</button>' + deleteButton + '</div></article>'
                        );
                    });

                    var unread = notifications.filter(function (notification) {
                        return !notification.read && locallyRead.indexOf(notification.id) === -1;
                    }).length;
                    $("#notification-count").text(unread).toggleClass("hidden", unread === 0);
                    $("#notification-status").text(notifications.length + " notifications.");
                },
                error: function () {
                    $("#notification-list").html('<p class="p-6 text-sm text-red-700">Notifications could not be loaded.</p>');
                }
            });
        };

        function escapeNotification(value) {
            return $("<div>").text(value == null ? "" : value).html();
        }

        $(document).on("click", "[data-notification-read]", function (event) {
            var id = $(this).attr("data-notification-read");
            var locallyRead = JSON.parse(localStorage.getItem("civicEventsReadNotifications") || "[]");
            if (locallyRead.indexOf(id) === -1) locallyRead.push(id);
            localStorage.setItem("civicEventsReadNotifications", JSON.stringify(locallyRead));

            var $article = $('[data-notification-id="' + id + '"]');
            $article.find("[data-notification-read]").prop("disabled", true).text("Read");
            $article.find(".bg-blue-100").removeClass("bg-blue-100 text-blue-900").addClass("bg-slate-100 text-slate-600").text("Read");
            $("#notification-status").text("Notification marked as read.");

            var unread = $("#notification-count").text();
            var nextUnread = Math.max(0, Number(unread || 0) - 1);
            $("#notification-count").text(nextUnread).toggleClass("hidden", nextUnread === 0);
            if ($(this).is("a")) window.location.href = $(this).attr("href");
        });

        $(document).on("click", "[data-delete-notification]", function () {
            var id = $(this).attr("data-delete-notification");
            if (!window.confirm("Delete this notification?")) return;
            apiRequest({
                url: BASE_URL + "/api/notifications/" + encodeURIComponent(id),
                method: "DELETE",
                success: function (response) {
                    showToast(response.message || "Notification deleted.", "success");
                    loadNotifications();
                },
                error: function (xhr) {
                    showToast((xhr.responseJSON && xhr.responseJSON.message) || "Unable to delete notification.", "error");
                }
            });
        });

        $(document).on("submit", "#notification-create-form", function (event) {
            event.preventDefault();
            var title = $.trim($("#notification-title").val());
            var message = $.trim($("#notification-message").val());
            if (!title || !message) {
                $("#notification-status").text("Title and message are required.");
                return;
            }

            apiRequest({
                url: BASE_URL + "/api/notifications",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({ title: title, message: message, type: "system", recipient_id: null, metadata: {} }),
                success: function (response) {
                    showToast(response.message || "Broadcast notification created.", "success");
                    $("#notification-create-form")[0].reset();
                    $("#notification-create-form").addClass("hidden");
                    loadNotifications();
                },
                error: function (xhr) {
                    showToast((xhr.responseJSON && xhr.responseJSON.message) || "Unable to create notification.", "error");
                }
            });
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
