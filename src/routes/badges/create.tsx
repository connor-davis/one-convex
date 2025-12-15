import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/badges/create")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/badges/create"!</div>;
}
