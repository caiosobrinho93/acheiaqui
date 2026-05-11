import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

import { cookies } from "next/headers"

export async function POST() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    await supabase.auth.signOut()
  }

  return redirect("/login")
}
