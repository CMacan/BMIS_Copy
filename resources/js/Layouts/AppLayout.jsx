import { Toaster } from "@/components/Toaster";

export default function AppLayout({ children }) {
    return (
        <>
            <Toaster />
            <main>{children}</main>
        </>
    );
}