import { login } from "./actions";
import Nav from "../components/Nav";

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Nav />
      <div className="flex-grow flex items-center justify-center bg-gray-100">
        <div className="rounded-lg border border-gray-100 shadow-2xl bg-white max-w-md w-full">
          <form>
            <div className="px-10 py-8 flex flex-col items-center">
              <p className="font-medium text-lg mb-4 text-center">Login</p>
              <button
                className="rounded-full border border-blue-500 px-10 py-4 text-sm font-medium text-blue-600 hover:bg-blue-50 transition"
                formAction={login}
              >
                Sign in with Google
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
