import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/galeri')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/galeri"!</div>
}
