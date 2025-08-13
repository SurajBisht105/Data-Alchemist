import Link from 'next/link';
import { Button } from '@/components/common/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="text-9xl font-bold text-gray-300">404</div>
        <h1 className="mt-4 text-3xl font-bold text-gray-900">
          Page not found
        </h1>
        <p className="mt-2 text-gray-600">
          Sorry, we could not find the page you are looking for.
        </p>
        <div className="mt-6">
          <Link href="/">
            <Button variant="primary">
              Go back home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
