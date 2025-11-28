import { doc, getDoc } from "firebase/firestore"
import { db, auth } from "../firebase"

export async function isAdmin() {
  const user = auth.currentUser
  if (!user) return false

  const snap = await getDoc(doc(db, "users", user.uid))
  if (!snap.exists()) return false

  return snap.data().isAdmin === true
}
