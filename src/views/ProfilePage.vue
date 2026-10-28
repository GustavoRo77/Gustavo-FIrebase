<template>
  <ion-page><ion-content><main class="page-shell"><section class="form-card">
    <h1 class="page-title">Meu perfil</h1>
    <div class="center"><img class="avatar" :src="preview || profile?.photoBase64 || profile?.photoURL || placeholder" alt="Prévia da foto de perfil" />
      <input ref="fileInput" class="file-input" type="file" accept="image/jpeg,image/png,image/webp" @change="selectPhoto" />
      <ion-button fill="outline" @click="fileInput?.click()"><ion-icon slot="start" :icon="'camera'" />Selecionar foto</ion-button>
    </div>
    <form @submit.prevent="save">
      <ion-item class="field" lines="none"><ion-input v-model="name" label="Nome completo" label-placement="stacked" autocomplete="name" required /></ion-item>
      <ion-item class="field" lines="none"><ion-input v-model="birthDate" label="Data de nascimento" label-placement="stacked" type="date" /></ion-item>
      <ion-item class="field" lines="none"><ion-input v-model="nickname" label="Apelido" label-placement="stacked" /></ion-item>
      <p v-if="message" class="notice" :class="success ? 'success' : 'error'">{{ message }}</p>
      <div class="button-row"><ion-button type="submit" :disabled="saving">{{ saving ? 'Salvando…' : 'Salvar alterações' }}</ion-button><ion-button type="button" fill="outline" @click="router.back()">Voltar</ion-button></div>
    </form>
  </section></main></ion-content></ion-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { IonButton, IonContent, IonIcon, IonInput, IonItem, IonPage } from '@ionic/vue'
import { auth } from '../firebase/config'
import { getUserProfile, saveUserProfile, type UserProfile } from '../services/userService'
import { friendlyError } from '../utils/errors'

const placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"%3E%3Crect width="120" height="120" rx="60" fill="%23e7eee9"/%3E%3Ccircle cx="60" cy="43" r="22" fill="%2394a69a"/%3E%3Cpath d="M20 112c3-25 18-38 40-38s37 13 40 38" fill="%2394a69a"/%3E%3C/svg%3E'
const router = useRouter()
const profile = ref<UserProfile | null>(null)
const name = ref(''), birthDate = ref(''), nickname = ref('')
const photo = ref<File | null>(null), preview = ref(''), fileInput = ref<HTMLInputElement | null>(null)
const saving = ref(false), message = ref(''), success = ref(false)

onMounted(async () => {
  await auth.authStateReady()
  const currentUser = auth.currentUser
  if (!currentUser) { await router.replace('/login'); return }
  try {
    profile.value = await getUserProfile(currentUser.uid)
    name.value = profile.value?.name || currentUser.displayName || ''
    birthDate.value = profile.value?.birthDate || ''
    nickname.value = profile.value?.nickname || ''
  } catch (error) { message.value = friendlyError(error) }
})

function selectPhoto(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    message.value = 'Escolha uma imagem JPEG, PNG ou WebP.'; success.value = false; input.value = ''; return
  }
  if (file.size > 10 * 1024 * 1024) {
    message.value = 'A imagem deve ter menos de 10 MB.'; success.value = false; input.value = ''; return
  }
  if (preview.value) URL.revokeObjectURL(preview.value)
  photo.value = file
  preview.value = URL.createObjectURL(file)
  message.value = ''
}

async function compressPhoto(file: File): Promise<string> {
  const source = URL.createObjectURL(file)
  try {
    const image = new Image()
    image.src = source
    await image.decode()
    const scale = Math.min(1, 512 / Math.max(image.naturalWidth, image.naturalHeight))
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale))
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale))
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Não foi possível preparar a foto. Tente outra imagem.')
    context.drawImage(image, 0, 0, canvas.width, canvas.height)
    const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((value) => value ? resolve(value) : reject(new Error('Não foi possível preparar a foto. Tente outra imagem.')), 'image/jpeg', 0.78))
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('Não foi possível ler a foto.'))
      reader.onerror = () => reject(new Error('Não foi possível ler a foto.'))
      reader.readAsDataURL(blob)
    })
  } finally { URL.revokeObjectURL(source) }
}

async function save() {
  const currentUser = auth.currentUser
  if (!currentUser) { await router.replace('/login'); return }
  if (!name.value.trim()) { message.value = 'Informe seu nome completo.'; success.value = false; return }
  saving.value = true
  message.value = ''
  try {
    const photoBase64 = photo.value ? await compressPhoto(photo.value) : profile.value?.photoBase64 ?? null
    await saveUserProfile(currentUser.uid, { name: name.value.trim(), birthDate: birthDate.value, nickname: nickname.value.trim(), photoURL: null, photoBase64 })
    profile.value = { uid: currentUser.uid, email: currentUser.email ?? '', name: name.value.trim(), birthDate: birthDate.value, nickname: nickname.value.trim(), photoURL: null, photoBase64 }
    photo.value = null
    success.value = true
    message.value = 'Alterações salvas com sucesso.'
  } catch (error) { success.value = false; message.value = friendlyError(error) }
  finally { saving.value = false }
}
</script>
