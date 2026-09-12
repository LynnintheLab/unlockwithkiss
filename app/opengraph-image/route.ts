import { redirect } from 'next/navigation';

// Keep previously shared direct image links working. New previews use the versioned path.
export function GET() {
  redirect('/share/for-athel-hands-v2.png');
}
