export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF7]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 border-2 border-copper border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-[#6B6B6B]">Chargement...</p>
      </div>
    </div>
  )
}
