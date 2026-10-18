const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {

        const response = await fetch(
            "http://localhost:5000/api/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        const data = await response.json();

        if (response.ok) {

            // Save logged-in user
            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            document.getElementById("loginMessage").textContent =
                data.message;

            // Go to dashboard
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 700);

        } else {

            document.getElementById("loginMessage").textContent =
                data.message;
        }

    } catch (error) {

        console.error(error);

        document.getElementById("loginMessage").textContent =
            "Unable to connect to server.";
    }

});