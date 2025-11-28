import { doc, setDoc, getDoc, collection, addDoc, getDocs } from "firebase/firestore"
import { db, auth } from "../firebase"

// Salvar documento na subcoleção "data"
export async function saveUserData(data: any) {
  const user = auth.currentUser
  if (!user) throw new Error("Usuário não autenticado")

  const ref = collection(db, "users", user.uid, "data")
  await addDoc(ref, data)
}

// Listar documentos da subcoleção
export async function listUserData() {
  const user = auth.currentUser
  if (!user) throw new Error("Usuário não autenticado")

  const ref = collection(db, "users", user.uid, "data")
  const snap = await getDocs(ref)

  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}
