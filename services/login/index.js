import { Router } from "express"
import { JWTAuthMiddleware } from "../../lib/auth.js"
import Author from "../authors/model.js"
import { createAccessToken } from "../../lib/tools.js"
export const loginRoute = Router()


loginRoute.post("/", async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await Author.checkCredentials(email, password)

    if (user) {
      const payload = { _id: user._id, role: user.role }
      const accessToken = await createAccessToken(payload)

      res.send({ accessToken })
    } else {
      next(createError(401, "Credentials are not ok!"))
    }
  } catch (error) {
    next(error)
  }
})

loginRoute.get("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const user = await Author.findById(req.user._id)
    res.send(user)
  } catch (error) {
    next(error)
  }
})
