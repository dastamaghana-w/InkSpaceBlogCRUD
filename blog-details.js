const blogDetails =
    document.getElementById("blogDetails");

const params =
    new URLSearchParams(window.location.search);

const blogId = params.get("id");


async function loadBlog() {

    if (!blogId) {

        blogDetails.innerHTML =
            "<p>Blog not found.</p>";

        return;
    }

    try {

        const response = await fetch(
            `http://localhost:5000/api/blogs/${blogId}`
        );

        const blog = await response.json();

        if (!response.ok) {

            blogDetails.innerHTML =
                `<p>${blog.message}</p>`;

            return;
        }

        blogDetails.innerHTML = `

            <div class="blog-detail-category">
                ${blog.category}
            </div>

            <h1>
                ${blog.title}
            </h1>

            <div class="blog-detail-meta">
                By ${blog.author}
            </div>

            <div class="blog-detail-content">
                ${blog.content}
            </div>

        `;

    } catch (error) {

        console.error(error);

        blogDetails.innerHTML =
            "<p>Unable to load blog.</p>";
    }
}


loadBlog();