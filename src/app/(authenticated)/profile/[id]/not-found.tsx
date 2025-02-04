export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <h2 className="text-2xl font-bold">User Not Found</h2>
      <p className="text-gray-600">
        Sorry, we couldn't find the user you're looking for.
      </p>
    </div>
  )
}
