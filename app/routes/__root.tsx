import { createRootRoute } from '@tanstack/react-router'
import { Link, Outlet, ScrollRestoration } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Body, Head, Html, Meta, Scripts } from '@tanstack/start'
import type { ReactNode } from 'react'
import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary'
import { NotFound } from '~/components/NotFound'
import appCss from '~/styles/app.css?url'
import { seo } from '~/utils/seo'

export const Route = createRootRoute({
  meta: () => [
    {
      charSet: 'utf-8',
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
    {
      name: 'google',
      content: 'notranslate',
    },
    ...seo({
      title: 'Matilda.lol',
      description: 'Egg',
    }),
  ],
  links: () => [
    { rel: 'stylesheet', href: appCss },
    {
      rel: 'apple-touch-icon',
      sizes: '128x128',
      href: '/icon-128x128.png',
    },
    { rel: 'manifest', href: '/site.webmanifest', color: '#fffff' },
    { rel: 'icon', href: '/4.svg', type: 'image/svg+xml' },
  ],
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    )
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <Html lang="en" translate="no">
      <Head>
        <Meta />
      </Head>
      <Body>
        {children}
        <ScrollRestoration />
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </Body>
    </Html>
  )
}
