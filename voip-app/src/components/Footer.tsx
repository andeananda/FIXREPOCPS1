export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-gray-900 tracking-tight">VoIP<span className="text-blue-600">Connect</span></span>
          </div>
          <p className="text-gray-500 text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} Kamailio VoIP Dashboard. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-gray-400 hover:text-gray-500 transition-colors">
              <span className="sr-only">Help</span>
              Help
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500 transition-colors">
              <span className="sr-only">Privacy</span>
              Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
