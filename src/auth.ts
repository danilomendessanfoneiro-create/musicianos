import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebase";

export function usernameToEmail(username: string) {
  return `${username}@app.com`.toLowerCase();
}

export async function loginWithUsername(username: string, password: string) {
  const email = usernameToEmail(username);
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function logoutUser() {
  return await signOut(auth);
}
