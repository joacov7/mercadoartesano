import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      username: string
      rol: string
      plan: string
      logoUrl: string | null
    } & DefaultSession["user"]
  }
}
