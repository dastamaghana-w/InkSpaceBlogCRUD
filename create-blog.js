const blogForm = document.getElementById("blogForm");

blogForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const title = document.getElementById("title").value;
    const category = document.getElementById("category").value;
    const content = document.getElementById("content").value;

    const storedUser = localStorage.getItem("user");

    const user = storedUser
        ? JSON.parse(storedUser)
        : null;

    try {

        const response = await fetch(
            "http://localhost:5000/api/blogs",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    title,
                    category,
                    content,
                    author: user ? user.name : "Anonymous"
                })
            }
        );

        const data = await response.json();

        if (response.ok) {

            document.getElementById("blogMessage").textContent =
                data.message;

            blogForm.reset();

        } else {

            document.getElementById("blogMessage").textContent =
                data.message;
        }

    } catch (error) {

        console.error(error);

        document.getElementById("blogMessage").textContent =
            "Unable to connect to server.";
    }

});