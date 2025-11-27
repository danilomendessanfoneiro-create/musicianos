import React from 'react'
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  async function handleEmail(e: React.FormEvent) {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const email = (form.elements.namedItem('email') as HTMLInputElement).value
    const pass = (form.elements.namedItem('password') as HTMLInputElement).value
    try {
      await signInWithEmailAndPassword(auth, email, pass)
      navigate('/')
    } catch (err) {
      alert('Erro no login: ' + (err as Error).message)
    }
  }
  async function handleGoogle() {
    try {
      await signInWithPopup(auth, googleProvider)
      navigate('/')
    } catch (err) {
      alert('Erro no login Google: ' + (err as Error).message)
    }
  }
  return (
    <div style={{padding:20}}>
      <h2>Login</h2>
      <form onSubmit={handleEmail}>
        <div>
          <label>Email</label><br/>
          <input name="email" type="email" />
        </div>
        <div>
          <label>Senha</label><br/>
          <input name="password" type="password" />
        </div>
        <button type="submit">Entrar</button>
      </form>
      <hr/>
      <button onClick={handleGoogle}>Entrar com Google</button>
    </div>
  )
}
