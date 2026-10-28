<template>
  <ion-page><ion-content><main class="page-shell"><section class="form-card">
    <h1 class="page-title">Criar conta</h1>
    <p class="page-subtitle">Preencha os dados para se cadastrar.</p>
    <form @submit.prevent="submit">
      <ion-item class="field" lines="none"><ion-input v-model="name" label="Nome completo" label-placement="stacked" autocomplete="name" required /></ion-item>
      <ion-item class="field" lines="none"><ion-input v-model="email" label="E-mail" label-placement="stacked" type="email" autocomplete="email" required /></ion-item>
      <ion-item class="field" lines="none"><ion-input v-model="password" label="Senha (mínimo 6 caracteres)" label-placement="stacked" type="password" autocomplete="new-password" required :minlength="6" /></ion-item>
      <ion-item class="field" lines="none"><ion-input v-model="confirm" label="Confirmar senha" label-placement="stacked" type="password" autocomplete="new-password" required /></ion-item>
      <p v-if="error" class="notice error">{{ error }}</p>
      <ion-button expand="block" type="submit" :disabled="loading">{{ loading ? 'Cadastrando…' : 'Cadastrar' }}</ion-button>
    </form>
    <div class="center"><router-link class="inline-link" to="/login">Voltar ao login</router-link></div>
  </section></main></ion-content></ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { IonButton, IonContent, IonInput, IonItem, IonPage } from '@ionic/vue'
import { register } from '../services/authService'
import { friendlyError } from '../utils/errors'

const router = useRouter()
const name = ref(''), email = ref(''), password = ref(''), confirm = ref('')
const loading = ref(false), error = ref('')

async function submit() {
  error.value = ''
  if (!name.value.trim() || !email.value.trim() || !password.value) { error.value = 'Preencha todos os campos.'; return }
  if (password.value.length < 6) { error.value = 'A senha deve ter pelo menos 6 caracteres.'; return }
  if (password.value !== confirm.value) { error.value = 'As senhas não são iguais.'; return }
  loading.value = true
  try { await register(name.value, email.value, password.value); await router.replace('/welcome') }
  catch (submitError) { error.value = friendlyError(submitError) }
  finally { loading.value = false }
}
</script>
