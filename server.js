const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const User = require("./models/User");
const Blog = require("./models/Blog");

const app = express();

// ==================== MIDDLEWARE ====================

app.use(cors());
app.use(express.json());

// ==================== MONGODB CONNECTION ====================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully ✅");
  })
  .catch((error) => {
    console.error("MongoDB connection failed ❌");
    console.error(error.message);
  });

// ==================== TEST ROUTE ====================

app.get("/", (req, res) => {
  res.json({
    message: "InkSpace Blog API is running 🚀",
  });
});

// ==================== USER REGISTRATION ====================

app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const user = new User({
      name,
      email,
      password,
    });

    await user.save();

    res.status(201).json({
      message: "Registration successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// ==================== USER LOGIN ====================

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter email and password",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// ==================== CREATE BLOG ====================

app.post("/api/blogs", async (req, res) => {
  try {
    const { title, content, author, category } = req.body;

    if (!title || !content || !author) {
      return res.status(400).json({
        message: "Title, content and author are required",
      });
    }

    const blog = new Blog({
      title,
      content,
      author,
      category: category || "General",
    });

    await blog.save();

    res.status(201).json({
      message: "Blog created successfully",
      blog,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create blog",
    });
  }
});

// ==================== GET ALL BLOGS ====================

app.get("/api/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({
      createdAt: -1,
    });

    res.json(blogs);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch blogs",
    });
  }
});

// ==================== GET SINGLE BLOG ====================

app.get("/api/blogs/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    res.json(blog);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch blog",
    });
  }
});

// ==================== DELETE BLOG ====================

app.delete("/api/blogs/:id", async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    res.json({
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete blog",
    });
  }
});

// ==================== SERVER ====================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// CREATE BLOG
app.post("/api/blogs", async (req, res) => {
  try {
    const { title, content, author, category } = req.body;

    if (!title?.trim() || !content?.trim() || !author?.trim()) {
      return res.status(400).json({
        message: "Title, content and author are required",
      });
    }

    const blog = await Blog.create({
      title: title.trim(),
      content: content.trim(),
      author: author.trim(),
      category: category?.trim() || "General",
    });

    res.status(201).json({
      message: "Blog created successfully",
      blog,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// READ ALL BLOGS + SEARCH + CATEGORY FILTER
app.get("/api/blogs", async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = {};

    if (search?.trim()) {
      const safeSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      filter.$or = [
        { title: { $regex: safeSearch, $options: "i" } },
        { content: { $regex: safeSearch, $options: "i" } },
        { author: { $regex: safeSearch, $options: "i" } },
      ];
    }

    if (category?.trim() && category !== "All") {
      filter.category = category.trim();
    }

    const blogs = await Blog.find(filter).sort({
      createdAt: -1,
    });

    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// READ SINGLE BLOG
app.get("/api/blogs/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid blog ID",
      });
    }

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE BLOG
app.put("/api/blogs/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid blog ID",
      });
    }

    const { title, content, author, category } = req.body;

    if (
      (title !== undefined && !title.trim()) ||
      (content !== undefined && !content.trim()) ||
      (author !== undefined && !author.trim())
    ) {
      return res.status(400).json({
        message: "Title, content and author cannot be empty",
      });
    }

    const updates = {};

    if (title !== undefined) updates.title = title.trim();
    if (content !== undefined) updates.content = content.trim();
    if (author !== undefined) updates.author = author.trim();
    if (category !== undefined) {
      updates.category = category.trim() || "General";
    }

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true },
    );

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    res.json({
      message: "Blog updated successfully",
      blog,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE BLOG
app.delete("/api/blogs/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid blog ID",
      });
    }

    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    res.json({
      message: "Blog deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
