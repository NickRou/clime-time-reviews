export default function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-10 lg:px-8">
        <p className="text-center text-sm leading-5 text-muted-foreground">
          © {new Date().getFullYear()} Clime Time Reviews. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
