// ===============================
// HOME PAGE - INKSPACE
// ===============================

const blogContainer = document.getElementById("blogContainer");

// ===============================
// LOAD ALL BLOGS
// ===============================

async function loadBlogs() {
  if (!blogContainer) {
    return;
  }

  try {
    blogContainer.innerHTML = `<p class="loading">Loading stories...</p>`;

    const response = await fetch("http://localhost:5000/api/blogs");

    const blogs = await response.json();

    if (!response.ok) {
      blogContainer.innerHTML = `<p>Unable to load stories.</p>`;

      return;
    }

    // No blogs available

    if (blogs.length === 0) {
      blogContainer.innerHTML = `
                <div class="no-blogs">
                    <h3>No stories yet</h3>
                    <p>Be the first person to share a story.</p>
                </div>
            `;

      return;
    }

    // Display blogs

    blogContainer.innerHTML = blogs
      .map((blog) => {
        return `

                    <article class="blog-card">

                        <div class="blog-card-image">

                            <span>
                                ${blog.category || "General"}
                            </span>

                        </div>


                        <div class="blog-card-content">

                            <div class="blog-category">
                                ${blog.category || "General"}
                            </div>


                            <h2>
                                ${blog.title}
                            </h2>


                            <p>
                                ${getShortContent(blog.content)}
                            </p>


                            <div class="blog-card-footer">

                                <span>
                                    By ${blog.author}
                                </span>


                                <button
                                    class="read-more"
                                    onclick="openBlog('${blog._id}')"
                                >
                                    Read →
                                </button>

                            </div>

                        </div>

                    </article>

                `;
      })
      .join("");
  } catch (error) {
    console.error("Error loading blogs:", error);

    blogContainer.innerHTML = `
            <div class="error-message">
                <p>
                    Unable to connect to the server.
                </p>

                <button onclick="loadBlogs()">
                    Try Again
                </button>
            </div>
        `;
  }
}

// ===============================
// SHORT BLOG CONTENT
// ===============================

function getShortContent(content) {
  if (!content) {
    return "";
  }

  if (content.length > 120) {
    return content.substring(0, 120) + "...";
  }

  return content;
}

// ===============================
// OPEN BLOG DETAILS
// ===============================

function openBlog(blogId) {
  window.location.href = `blog-details.html?id=${blogId}`;
}

// const blogContainer = document.getElementById("blogContainer");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const filterButton = document.getElementById("filterButton");

async function loadBlogs() {
  if (!blogContainer) return;

  blogContainer.innerHTML = "<p>Loading stories...</p>";

  try {
    const params = new URLSearchParams();

    if (searchInput?.value.trim()) {
      params.set("search", searchInput.value.trim());
    }

    if (categoryFilter?.value) {
      params.set("category", categoryFilter.value);
    }

    const response = await fetch(
      `http://localhost:5000/api/blogs?${params.toString()}`,
    );

    const blogs = await response.json();

    if (!response.ok) {
      throw new Error(blogs.message || "Unable to load blogs");
    }

    if (blogs.length === 0) {
      blogContainer.innerHTML = "<p>No stories found. Try another search.</p>";
      return;
    }

    blogContainer.innerHTML = blogs
      .map(
        (blog) => `
            <article class="blog-card">
                <div class="blog-card-content">
                    <span class="blog-category">
                        ${escapeHTML(blog.category || "General")}
                    </span>

                    <h2>${escapeHTML(blog.title)}</h2>

                    <p>${escapeHTML(
                      (blog.content || "").slice(0, 120),
                    )}${blog.content?.length > 120 ? "..." : ""}</p>

                    <div class="blog-card-footer">
                        <span>By ${escapeHTML(blog.author)}</span>
                        <a href="blog-details.html?id=${encodeURIComponent(blog._id)}">
                            Read →
                        </a>
                    </div>

                    <div class="blog-actions">
                        <button onclick="editBlog('${blog._id}')">
                            Edit
                        </button>
                        <button onclick="deleteBlog('${blog._id}')">
                            Delete
                        </button>
                    </div>
                </div>
            </article>
        `,
      )
      .join("");
  } catch (error) {
    console.error(error);
    blogContainer.innerHTML =
      "<p>Unable to load stories. Check that your backend is running.</p>";
  }
}

function escapeHTML(value = "") {
  return String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char],
  );
}

function editBlog(id) {
  window.location.href = `edit-blog.html?id=${encodeURIComponent(id)}`;
}

async function deleteBlog(id) {
  if (!confirm("Are you sure you want to delete this blog?")) {
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:5000/api/blogs/${encodeURIComponent(id)}`,
      { method: "DELETE" },
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Delete failed");
    }

    alert("Blog deleted successfully!");
    loadBlogs();
  } catch (error) {
    alert(error.message);
  }
}

filterButton?.addEventListener("click", loadBlogs);

searchInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") loadBlogs();
});

categoryFilter?.addEventListener("change", loadBlogs);

loadBlogs();

// ===============================
// START
// ===============================

loadBlogs();
