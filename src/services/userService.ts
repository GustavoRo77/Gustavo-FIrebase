import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase/config'
export interface UserProfile { uid: string; name: string; email: string; birthDate: string; nickname: string; photoURL: string | null; photoBase64?: string | null }
const userRef = (uid: string) => doc(db, 'users', uid)
export async function createUserProfile(profile: Pick<UserProfile, 'uid' | 'name' | 'email'>) { await setDoc(userRef(profile.uid), { ...profile, birthDate: '', nickname: '', photoURL: null, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }) }
export async function getUserProfile(uid: string): Promise<UserProfile | null> { const snapshot = await getDoc(userRef(uid)); return snapshot.exists() ? snapshot.data() as UserProfile : null }
export async function saveUserProfile(uid: string, changes: Partial<Pick<UserProfile, 'name' | 'birthDate' | 'nickname' | 'photoURL' | 'photoBase64'>>) {
  const reference = userRef(uid)
  const snapshot = await getDoc(reference)
  const initialFields = snapshot.exists() ? {} : {
    uid,
    email: auth.currentUser?.email ?? '',
    birthDate: '',
    nickname: '',
    photoURL: null,
    photoBase64: null,
    createdAt: serverTimestamp(),
  }
  await setDoc(reference, { ...initialFields, ...changes, updatedAt: serverTimestamp() }, { merge: true })
}
