import { hydrateRoot } from 'react-dom/client'
import { StartClient } from '@tanstack/start'
import { createRouter } from './router'

const router = createRouter()

// biome-ignore lint/style/noNonNullAssertion: Can safely assume the element exists
hydrateRoot(document.getElementById('root')!, <StartClient router={router} />)
