import Link from "next/link"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "403 - Forbidden",
  description: "Access denied",
}

export default function ForbiddenPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted px-4">
      <div className="w-full max-w-md text-center space-y-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-destructive/20 rounded-full blur-2xl" />
            <div className="relative bg-destructive/10 p-6 rounded-full">
              <AlertTriangle className="w-16 h-16 text-destructive" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h1 className="text-5xl font-bold text-foreground">403</h1>
          <h2 className="text-2xl font-semibold text-foreground">Bạn không có quyền truy cập</h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            Rất tiếc, bạn không có quyền truy cập tài nguyên này. Nếu bạn cho rằng đây là lỗi, vui lòng liên hệ với bộ phận hỗ trợ.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button asChild variant="default" size="lg">
            <Link href="/home">Go Home</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/contact">Contact Support</Link>
          </Button>
        </div>

        {/* Footer */}
        <div className="pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Error Code: <span className="font-mono font-semibold">403</span>
          </p>
        </div>
      </div>
    </main>
  )
}
