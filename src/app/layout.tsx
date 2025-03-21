import { ReactNode, Suspense, lazy } from "react"
import AssistantProvider from "@/providers/AssistantProvider"
import { WEBSITE_NAME } from "@/constants/constants";

const FloatingGoVirtualAssistant = lazy(() => import("@/components/FloatingGoVirtualAssistant"))

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <head>
                <title>{WEBSITE_NAME}</title>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                <link rel="icon" href="/favicon.ico" type="image/x-icon" />
            </head>
            <body
                style={{ margin: 0, padding: 0 }}
            >
                <AssistantProvider>
                    <main>
                        {children}
                    </main>
                    <Suspense fallback={null}>
                        <FloatingGoVirtualAssistant />
                    </Suspense>
                </AssistantProvider>
            </body>
        </html>
    )
}
