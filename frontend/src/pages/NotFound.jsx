import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="max-w-md text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-moss-50 text-moss-500">
          <Compass size={24} />
        </span>
        <h1 className="mt-5 font-display text-3xl text-ink-900">This page is off the trail</h1>
        <p className="mt-2 text-sm text-ink-500">
          The link may be out of date, or the record was removed. Head back to the dashboard and start
          again from there.
        </p>
        <Link to="/" className="mt-6 inline-block">
          <Button>Back to dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
