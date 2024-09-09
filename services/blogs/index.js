import { Router } from "express"
import Blog from "./model.js"
import Comment from "../comments/model.js"
import q2m from "query-to-mongo"
import cloudinaryUploader from "../../config/index.js"
import { JWTAuthMiddleware } from "../../lib/auth.js"
export const blogRoute = Router()

blogRoute.get("/", JWTAuthMiddleware,async (req, res, next) => {
  try {
    //http://localhost:3001/blogs?title=/tech/i

    let { criteria } = q2m(req.query)
    console.log(criteria)
    let blogs = await Blog.find(criteria).populate({
      path: "comments",
      populate: {
        path: "author",
        model: "Author",
        select: ["name", "lastName", "avatar"],
      },
    })
    res.send(blogs)
  } catch (error) {
    next(error)
  }
})

blogRoute.get("/:id", JWTAuthMiddleware, async (req, res, next) => {
  try {
    let blog = await Blog.findById(req.params.id)
    res.send(blog)
  } catch (error) {
    next(error)
  }
})

blogRoute.get("/:id/comments", JWTAuthMiddleware, async (req, res, next) => {
  try {
    let comments = await Comment.find({
      blog: req.params.id,
    }).populate({
      path: "author",
      model: "Author",
      select: ["name", "lastName", "avatar"],
    })
    res.send(comments)
  } catch (error) {
    next(error)
  }
})

blogRoute.get("/:id/comments/:commentId", JWTAuthMiddleware, async (req, res, next) => {
  try {
    let comments = await Comment.find({
      blog: req.params.id,
      _id: req.params.commentId,
    }).populate({
      path: "author",
      model: "Author",
      select: ["name", "lastName", "avatar"],
    })
    res.send(comments)
  } catch (error) {
    next(error)
  }
})

blogRoute.put("/:id", JWTAuthMiddleware, async (req, res, next) => {
  try {
    let blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
    res.send(blog)
  } catch (error) {
    next(error)
  }
})

blogRoute.put("/:id/comments/:commentId", JWTAuthMiddleware, async (req, res, next) => {
  try {
    let comment = await Comment.findOneAndUpdate(
      {
        blog: req.params.id,
        _id: req.params.commentId,
      },
      req.body,
      { new: true }
    ).populate({
      path: "author",
      model: "Author",
      select: ["name", "lastName", "avatar"],
    })
    res.send(comment)
  } catch (error) {
    next(error)
  }
})
blogRoute.patch("/:id/cover", JWTAuthMiddleware, cloudinaryUploader, async (req, res, next) => {
  try {
    let updated = await Blog.findByIdAndUpdate(
      req.params.id,
      { cover: req.file.path },
      { new: true }
    )
    res.send(updated)
  } catch (error) {
    next(error)
  }
})
blogRoute.delete("/:id", JWTAuthMiddleware, async (req, res, next) => {
  try {
    await Blog.deleteOne({
      _id: req.params.id,
    })
    res.send(204)
  } catch (error) {
    next(error)
  }
})

blogRoute.delete("/:id/comments/:commentId", JWTAuthMiddleware, async (req, res, next) => {
  try {
    await Comment.findOneAndDelete({
      blog: req.params.id,
      _id: req.params.commentId,
    })
    res.send(204)
  } catch (error) {
    next(error)
  }
})

blogRoute.post("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    let blog = await Blog.create(req.body)
    res.send(blog)
  } catch (error) {
    next(error)
  }
})

blogRoute.post("/:id", JWTAuthMiddleware, async (req, res, next) => {
  try {
    let newComment = await Comment.create({ ...req.body, blog: req.params.id })
    console.log(newComment)
    let post = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: newComment,
        },
      },
      { new: true }
    ).populate({
      path: "comments",
      populate: {
        path: "author",
        model: "Author",
        select: ["name", "lastName", "avatar"],
      },
    })
    res.send(post)
  } catch (error) {
    next(error)
  }
})
