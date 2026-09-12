import { createHash, timingSafeEqual } from 'node:crypto';
import { rows } from './database';
export function hash(value: string) { return createHash('sha256').update(value).digest('hex'); }
export function matches(value: string, expected: string) { return timingSafeEqual(Buffer.from(hash(value),'hex'), Buffer.from(hash(expected),'hex')); }
export function passwordFor(role: string) {
  const password = process.env[role === 'admin' ? 'ADMIN_PASSWORD' : 'GUEST_PASSWORD'];
  if (!password) throw new Error('Passwords are not configured');
  return password;
}
export function token(request: Request) { return request.headers.get('cookie')?.match(/(?:^|;\s*)diary_session=([a-f0-9]{64})(?:;|$)/)?.[1]; }
export async function role(request: Request) {
  const value = token(request); if (!value) return null;
  return (await rows<{role:string}>('SELECT role FROM diary_sessions WHERE token=? AND expires>?',[hash(value),Date.now()]))[0]?.role;
}
export async function config() { return (await rows<{drive:string;unlocked:number}>('SELECT drive,unlocked FROM diary_settings WHERE id=1'))[0]; }
export function reply(data: unknown, status=200, headers: Record<string,string>={}) { return Response.json(data,{status,headers:{'Cache-Control':'private, no-store, max-age=0',...headers}}); }
export function origin(request: Request) {
  const configured=process.env.APP_URL;
  if(configured) return new URL(configured).origin;
  if(process.env.NODE_ENV==='production') throw new Error('APP_URL is required in production');
  return new URL(request.url).origin;
}
export function cookie(request: Request, value: string, maxAge: number) {
  return `diary_session=${value}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${maxAge}${origin(request).startsWith('https://')?'; Secure':''}`;
}
