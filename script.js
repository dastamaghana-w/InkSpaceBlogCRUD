document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       CURRENT YEAR
    ========================= */

    const year = document.getElementById("year");

    if (year) {

        year.textContent =
            new Date().getFullYear();

    }


    /* =========================
       THEME BUTTON
    ========================= */

    const themeBtn =
        document.getElementById("themeBtn");

    if (themeBtn) {

        themeBtn.addEventListener(
            "click",
            function () {

                document.body.classList.toggle(
                    "light-mode"
                );

                if (
                    document.body.classList.contains(
                        "light-mode"
                    )
                ) {

                    themeBtn.textContent = "☀";

                } else {

                    themeBtn.textContent = "☾";

                }

            }
        );

    }


    /* =========================
       LOGIN
    ========================= */

    const loginForm =
        document.getElementById("loginForm");

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                window.location.href =
                    "dashboard.html";

            }
        );

    }


    /* =========================
       REGISTER
    ========================= */

    const registerForm =
        document.getElementById("registerForm");

    if (registerForm) {

        registerForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                const passwords =
                    registerForm.querySelectorAll(
                        'input[type="password"]'
                    );

                if (
                    passwords.length >= 2 &&
                    passwords[0].value !==
                    passwords[1].value
                ) {

                    alert(
                        "Passwords do not match."
                    );

                    return;

                }

                window.location.href =
                    "dashboard.html";

            }
        );

    }


    /* =========================
       CREATE BLOG
    ========================= */

    const blogForm =
        document.getElementById("blogForm");

    if (blogForm) {

        blogForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                const title =
                    document.getElementById(
                        "title"
                    ).value.trim();


                if (!title) {

                    alert(
                        "Please enter a blog title."
                    );

                    return;

                }


                alert(
                    "Your story has been published successfully! ✨"
                );


                window.location.href =
                    "dashboard.html";

            }
        );

    }


    /* =========================
       SCROLL REVEAL
    ========================= */

    const revealElements =
        document.querySelectorAll(
            ".reveal"
        );


    const observer =
        new IntersectionObserver(
            function (entries) {

                entries.forEach(
                    function (entry) {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.style.opacity =
                                "1";

                            entry.target.style.transform =
                                "translateY(0)";

                        }

                    }
                );

            },
            {
                threshold: 0.12
            }
        );


    revealElements.forEach(
        function (element, index) {

            element.style.animationDelay =
                `${index * 80}ms`;

            observer.observe(element);

        }
    );

});