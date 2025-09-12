export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <h1 className="text-4xl font-bold">404</h1>
            <h2 className="text-2xl">Page Not Found</h2>
            <p className="text-gray-600">The page you're looking for doesn't exist.</p>
            <a
                href="/"
                className="mt-4 px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
            >
                Return Home
            </a>
        </div>
    );
}