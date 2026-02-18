import { LogIn } from "lucide-react"
import { Button } from "./ui/button"

export const Navbar = () => {
  return (
    <header className="shadow-sm border-b border-gray-200 py-2 px-2">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
            <h1 className="text-2xl font-bold">Agent</h1>

            <Button>
                <span>Login</span>
                <LogIn />
            </Button>
        </nav>
    </header>
  )
}
