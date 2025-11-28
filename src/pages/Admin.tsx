import { useEffect, useState } from "react"
import { db } from "../firebase"
import { collection, getDocs } from "firebase/firestore"
import { useUserData } from "../services/authService"

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([])
  const userData = useUserData()

  // Só deixa a página carregar se for admin
  const isAdmin = userData?.role === "admin"

  useEffect(() => {
    async function loadUsers() {
      if (!isAdmin) return

      // Busca os usuários do Firestore (coleção app_users)
      const snap = await getDocs(collection(db, "app_users"))
      const list = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setUsers(list)
    }

    loadUsers()
  }, [isAdmin])

  if (!isAdmin) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Acesso negado</h2>
        <p>Você não tem permissão para acessar esta página.</p>
      </div>
    )
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Painel do Administrador</h1>

      <h3>Usuários cadastrados:</h3>
      <ul>
        {users.map(u => (
          <li key={u.id}>
            <b>{u.username}</b> — role: {u.role}
          </li>
        ))}
      </ul>
    </div>
  )
}
