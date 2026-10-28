import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth'
import { auth } from '../firebase/config'
import { createUserProfile } from './userService'
export const login = (email: string, password: string) => signInWithEmailAndPassword(auth, email.trim(), password)
export async function register(name: string, email: string, password: string) { const credential = await createUserWithEmailAndPassword(auth, email.trim(), password); try { await updateProfile(credential.user, { displayName: name.trim() }); await createUserProfile({ uid: credential.user.uid, name: name.trim(), email: credential.user.email ?? email.trim() }) } catch (error) { await signOut(auth); throw error }; return credential }
export const resetPassword = (email: string) => sendPasswordResetEmail(auth, email.trim())
export const logout = () => signOut(auth)
