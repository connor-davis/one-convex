import SignInForm from "@/components/forms/sign-in";
import { ThemeProvider } from "@/components/providers/theme-provider";
import AppSidebar from "@/components/sidebar/app-sidebar";
import { Label } from "@/components/ui/label";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { Spinner } from "@/components/ui/spinner";
import { ConvexProviderWithAuthKit } from "@convex-dev/workos";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, Outlet, useRouter } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { AuthKitProvider, useAuth } from "@workos-inc/authkit-react";
import {
  Authenticated,
  AuthLoading,
  ConvexReactClient,
  Unauthenticated,
} from "convex/react";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

export const Route = createRootRoute({
  component: () => {
    const router = useRouter();

    return (
      <ThemeProvider defaultTheme="system" defaultAppearance="one">
        <AuthKitProvider
          clientId={import.meta.env.VITE_WORKOS_CLIENT_ID}
          redirectUri={import.meta.env.VITE_WORKOS_REDIRECT_URI}
          onRedirectCallback={() => {
            router.navigate({
              to: "/",
              replace: true,
              reloadDocument: true,
            });
          }}
        >
          <ConvexProviderWithAuthKit client={convex} useAuth={useAuth}>
            <div className="flex flex-col w-screen h-screen bg-muted">
              <AuthLoading>
                <div className="flex flex-col w-full h-full items-center justify-center">
                  <div className="flex items-center gap-3">
                    <Spinner className="text-primary" />
                    <Label className="text-muted-foreground">
                      Checking authentication...
                    </Label>
                  </div>
                </div>
              </AuthLoading>

              <Authenticated>
                <SidebarProvider>
                  <AppSidebar />

                  <SidebarInset>
                    <div className="flex flex-col w-full h-full p-3 gap-3">
                      <div className="flex items-center w-full gap-3">
                        <SidebarTrigger />
                        <Label>One</Label>
                      </div>

                      <Outlet />
                    </div>
                  </SidebarInset>
                </SidebarProvider>
              </Authenticated>

              <Unauthenticated>
                <SignInForm />
              </Unauthenticated>

              {import.meta.env.VITE_MODE === "development" && (
                <TanStackDevtools
                  config={{
                    position: "bottom-right",
                  }}
                  plugins={[
                    {
                      name: "Tanstack Router",
                      render: <TanStackRouterDevtoolsPanel />,
                    },
                  ]}
                />
              )}

              <Toaster />
            </div>
          </ConvexProviderWithAuthKit>
        </AuthKitProvider>
      </ThemeProvider>
    );
  },
});
