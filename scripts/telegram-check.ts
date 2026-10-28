// Проверка Telegram-канала заявок. Токен и chat_id читаются из .env.local, в консоль не выводятся.
//   npm run telegram:chats  — проверить токен и показать чаты, где бот получил сообщения
//   npm run telegram:test   — отправить тестовое сообщение в TELEGRAM_CHAT_ID
const token = process.env.TELEGRAM_BOT_TOKEN
const chatId = process.env.TELEGRAM_CHAT_ID
const mode = process.argv[2] ?? 'chats'

type TgResponse<T> = { ok: boolean; result?: T; description?: string }

async function call<T>(method: string, body?: unknown): Promise<T> {
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: body ? 'POST' : 'GET',
    headers: body ? { 'content-type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(10000),
  })
  const json = (await res.json()) as TgResponse<T>
  if (!json.ok) throw new Error(`${method}: ${json.description ?? res.status}`)
  return json.result as T
}

async function main() {
  if (!token) {
    console.error('TELEGRAM_BOT_TOKEN не задан в .env.local')
    process.exit(1)
  }
  const me = await call<{ username: string }>('getMe')
  console.log(`Бот найден: @${me.username}`)

  if (mode === 'chats') {
    const updates = await call<{ message?: { chat: { id: number; type: string; title?: string; first_name?: string } }; my_chat_member?: { chat: { id: number; type: string; title?: string } } }[]>('getUpdates')
    const chats = new Map<number, string>()
    for (const u of updates) {
      const c = u.message?.chat ?? u.my_chat_member?.chat
      if (c) chats.set(c.id, `${c.type}: ${('title' in c && c.title) || ('first_name' in c && c.first_name) || ''}`)
    }
    if (!chats.size) {
      console.log('Чатов пока нет. Добавьте бота в чат и напишите в нём любое сообщение, затем повторите команду.')
      return
    }
    console.log('Чаты (значение для TELEGRAM_CHAT_ID — число слева):')
    for (const [id, label] of chats) console.log(`  ${id}  ${label}`)
    return
  }

  if (mode === 'test') {
    if (!chatId) {
      console.error('TELEGRAM_CHAT_ID не задан в .env.local')
      process.exit(1)
    }
    await call('sendMessage', { chat_id: chatId, text: 'Проверка канала заявок сайта EnZoo. Это тестовое сообщение, не заявка.' })
    console.log('Тестовое сообщение отправлено.')
  }
}

main().catch((e) => {
  console.error('Ошибка:', e instanceof Error ? e.message : e)
  process.exit(1)
})
