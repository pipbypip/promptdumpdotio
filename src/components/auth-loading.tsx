export function AuthLoading() {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm">
      <div className="flex items-center justify-center min-h-screen">
        <div className="space-y-4 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-12 w-12 bg-purple-500/20 rounded-full mx-auto" />
            <div className="h-4 w-32 bg-purple-500/20 rounded mx-auto" />
          </div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    </div>
  )
}
