import { onAuthStateChanged } from 'firebase/auth'
import { onMounted, onUnmounted, ref } from 'vue'
import { auth } from '../firebase/config'
const user = ref(auth.currentUser), ready = ref(false)
export function useAuth() { let unsubscribe: (() => void) | undefined; onMounted(() => { unsubscribe = onAuthStateChanged(auth, (value) => { user.value = value; ready.value = true }) }); onUnmounted(() => unsubscribe?.()); return { user, ready } }
