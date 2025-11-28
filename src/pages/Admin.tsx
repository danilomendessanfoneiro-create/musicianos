import { useEffect, useState } from "react"
import { isAdmin } from "../services/admin"
import { db } from "../firebase"
import { collection, getDocs } from "firebase/firestore"

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([])
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    async function load() {
      const ok = await isAdmin()
      setAllowed(ok)

      if (ok) {
        const snap = await getDocs(collection(db, "users"))
        const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setUsers(list)
      }
    }
    load()
  }, [])

  if (!allowed) return <div>Acesso negado</div>

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin</h1>
      <h3>Usuários:</h3>
      <ul>
        {users.map(u => (
          <li key={u.id}>{u.username}</li>
        ))}
      </ul>
    </div>
  )
}
