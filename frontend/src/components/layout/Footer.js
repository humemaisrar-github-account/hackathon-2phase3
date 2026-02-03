export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Todo Web Application. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}