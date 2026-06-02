import { redirect } from "next/navigation"

export default function RedirectToUnifiedAuth() {
  redirect("/login?register=true")
}
