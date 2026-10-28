export function friendlyError(error: unknown): string {
  const code = typeof error === 'object' && error !== null && 'code' in error
    ? String((error as { code: unknown }).code)
    : ''
  const messages: Record<string, string> = {
    'auth/invalid-email': 'O e-mail informado não é válido.',
    'auth/user-disabled': 'Esta conta foi desativada.',
    'auth/user-not-found': 'Não encontramos uma conta com esse e-mail.',
    'auth/wrong-password': 'E-mail ou senha incorretos.',
    'auth/invalid-credential': 'E-mail ou senha incorretos.',
    'auth/email-already-in-use': 'Este e-mail já está cadastrado.',
    'auth/weak-password': 'Escolha uma senha com pelo menos 6 caracteres.',
    'auth/too-many-requests': 'Muitas tentativas. Aguarde um pouco e tente novamente.',
    'auth/network-request-failed': 'Falha de conexão. Verifique sua internet.',
    'permission-denied': 'O Firebase negou o acesso. Confira as regras do Firestore e se o usuário está autenticado.',
    'resource-exhausted': 'A foto ou os dados excedem o limite permitido pelo Firestore. Tente uma imagem menor.',
  }
  return messages[code] ?? (error instanceof Error && error.message
    ? error.message
    : 'Não foi possível concluir a operação. Confira sua conexão e a configuração do Firebase.')
}
