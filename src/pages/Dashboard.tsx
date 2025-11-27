import React from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'

export default function Dashboard() {
  return (
    <div style={{padding:20}}>
      <h1>Dashboard</h1>
      <p>Bem-vindo ao MusicianOS — versão limpa e pronta para configurar.</p>
      <button onClick={() => signOut(auth)}>Sair</button>
    </div>
  )
}
