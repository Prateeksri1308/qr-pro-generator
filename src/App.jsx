
import QRCustomizer from './components/QRCustomizer';
import BatchUpload from './components/BatchUpload';
import DynamicLinks from './components/DynamicLinks';
import Signup from './components/Signup';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <header className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-blue-900 text-white flex items-center justify-center font-bold">in</div>
            <div>
              <h1 className="text-2xl font-semibold">LinkedIn QR — Pro</h1>
              <p className="text-sm text-gray-500">Batch, dynamic links, analytics & premium styling</p>
            </div>
          </div>
        </header>
        <main className="grid md:grid-cols-2 gap-6">
          <QRCustomizer />
          <div className="space-y-6">
            <BatchUpload />
            <DynamicLinks />
            <Signup />
          </div>
        </main>
        <footer className="text-center text-sm text-gray-500">Built with ❤️ • Client-side + Node backend demo</footer>
      </div>
    </div>
  );
}
