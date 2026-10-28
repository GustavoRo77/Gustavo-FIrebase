# Aplicativo Ionic Vue + Firebase

Aplicativo responsivo feito com Ionic Vue 3, TypeScript, Capacitor e SDK modular do Firebase. A foto de perfil é reduzida, convertida para Base64 e armazenada no documento do usuário no Firestore.

## Configuração e execução

1. Instale Node.js LTS.
2. Copie `.env.example` para `.env` e preencha as variáveis com as credenciais do seu app Web no Firebase Console.
3. Execute `npm install` e `npm run dev`.
4. Para conferir os tipos e gerar a versão de produção, execute `npm run typecheck` e `npm run build`.

## Firebase Console

Crie um projeto e registre um app Web. Em **Authentication > Sign-in method**, ative **E-mail/senha**. Crie um banco em **Firestore Database**. Copie a API Key, Auth Domain, Project ID, Messaging Sender ID e App ID para o `.env`.

Publique `firestore.rules` em **Firestore Database > Regras**. As regras exigem autenticação, limitam o acesso ao documento do próprio usuário e restringem o tamanho da foto Base64. O aplicativo não usa Firebase Storage para as fotos.

O envio de recuperação usa `sendPasswordResetEmail` do Firebase. Confirme também que o domínio do app está na lista de domínios autorizados em Authentication.

## Telas

- `/login`: login, mostrar ou ocultar senha, cadastro e recuperação de senha.
- `/register`: cria a conta no Authentication e o documento `users/{uid}`.
- `/reset-password`: envia o e-mail de redefinição do Firebase.
- `/welcome`: carrega o perfil e oferece acesso ao perfil e saída da conta.
- `/profile`: edita nome, data de nascimento, apelido e foto; a imagem fica no campo `photoBase64` de `users/{uid}`.

## Android

Instale o Android Studio e o SDK Android. Execute `npm run cap:sync`, depois `npx cap add android` (uma vez) e `npm run android`. Após alterações no app Web, rode `npm run cap:sync` novamente.

Cada documento do Firestore tem limite de 1 MiB. O app reduz a foto para até 512 × 512 pixels antes de salvá-la para caber nesse limite. Sem credenciais válidas e serviços ativados no Console, autenticação, Firestore e recuperação de senha não poderão se conectar.
