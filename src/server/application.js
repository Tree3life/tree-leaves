import {post,get} from './index'

export const login = user => post("/app/login", user)
export const logout = () => get("/app/logout")
