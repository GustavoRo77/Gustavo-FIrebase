<template>
  <ion-page><ion-content><main class="page-shell"><section class="form-card center">
    <h1 class="page-title">Boas-vindas</h1>
    <p v-if="loading" class="page-subtitle">Carregando seu perfil…</p>
    <template v-else>
      <img v-if="profile?.photoBase64 || profile?.photoURL" class="avatar" :src="profile.photoBase64 || profile.photoURL || ''" alt="Foto de perfil" />
      <ion-icon v-else :icon="'person-circle'" style="font-size:112px;color:#84968a" />
      <p class="page-subtitle">Olá, {{ profile?.nickname || profile?.name || user?.displayName || 'usuário' }}.</p>
      <p v-if="!profile?.birthDate || !profile?.nickname" class="notice">Seu perfil ainda não está completo. Você pode preenchê-lo na tela Meu perfil.</p>
      <p v-if="error" class="notice error">{{ error }}</p>
      <div class="button-row"><ion-button router-link="/profile" expand="block">Meu perfil</ion-button><ion-button fill="outline" expand="block" @click="leave">Sair</ion-button></div>
    </template>
  </section></main></ion-content></ion-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { IonButton, IonContent, IonIcon, IonPage } from '@ionic/vue'
import { auth } from '../firebase/config'
import { useAuth } from '../composables/useAuth'
import { logout } from '../services/authService'
import { getUserProfile, type UserProfile } from '../services/userService'
import { friendlyError } from '../utils/errors'

const { user } = useAuth()
const router = useRouter()
const profile = ref<UserProfile | null>(null)
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  let timeoutId: number | undefined
  try {
    // The route guard waits for Firebase, but the composable's listener may still
    // be delivering its first event. Read the initialized Auth state directly.
    await auth.authStateReady()
    const currentUser = auth.currentUser
    if (!currentUser) {
      await router.replace('/login')
      return
    }

    const timeout = new Promise<never>((_, reject) => {
      timeoutId = window.setTimeout(() => reject(new Error('O Firebase demorou para responder. Verifique sua conexão e as regras do Firestore.')), 15000)
    })
    profile.value = await Promise.race([getUserProfile(currentUser.uid), timeout])
  } catch (loadError) {
    error.value = friendlyError(loadError)
  } finally {
    if (timeoutId !== undefined) window.clearTimeout(timeoutId)
    loading.value = false
  }
})

async function leave() {
  try { await logout(); await router.replace('/login') }
  catch (logoutError) { error.value = friendlyError(logoutError) }
}
</script>
