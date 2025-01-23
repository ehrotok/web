// src/index.js
import { worker } from '~/mocks/node'

export default defineNuxtPlugin(async () => {
  await worker.start({ onUnhandledRequest: 'bypass' })
})
