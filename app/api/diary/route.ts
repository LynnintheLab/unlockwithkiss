import { randomBytes } from 'node:crypto';
import { execute, rows } from '@/lib/database';
import { role, config, reply, hash, passwordFor, matches, token, origin, cookie } from '@/lib/diary';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
function report(error: unknown) { console.error('Diary request failed:', error instanceof Error ? error.name : 'Unknown error'); }
export async function GET(request: Request) {
  try {
    const currentRole=await role(request);
    if(!currentRole) return reply({authenticated:false});
    const settings=await config();
    return reply({authenticated:true,role:currentRole,unlocked:!!settings.unlocked,
      drive:currentRole==='admin'||settings.unlocked ? settings.drive : undefined});
  } catch(error) { report(error);return reply({error:'Our little corner is temporarily unavailable. Please try again.'},503); }
}
export async function POST(request: Request) {
  try {
    // APP_URL handles Hostinger's HTTPS reverse proxy without trusting incoming proxy headers.
    if(request.headers.get('origin') !== origin(request)) return reply({error:'Please use this site to make changes.'},403);
    if(!request.headers.get('content-type')?.includes('application/json')) return reply({error:'Invalid request.'},415);
    const raw=await request.text();
    if(raw.length>8192) return reply({error:'Request is too large.'},413);
    let body: {action?:string;role?:string;password?:unknown;drive?:unknown};
    try { body=JSON.parse(raw); } catch {return reply({error:'Invalid request.'},400);}
    if(!body||typeof body!=='object') return reply({error:'Invalid request.'},400);
    if(body.action==='login') {
      const loginRole=body.role==='admin'?'admin':'guest';
      const expected=passwordFor(loginRole); const now=Date.now();
      // Two shared buckets avoid depending on spoofable forwarded IP headers.
      await execute(`INSERT INTO diary_attempts (bucket,attempts,expires) VALUES (?,1,?)
        ON DUPLICATE KEY UPDATE attempts=IF(expires<?,1,attempts+1), expires=IF(expires<?,VALUES(expires),expires)`,
        [loginRole,now+900000,now,now]);
      const attempt=(await rows<{attempts:number}>('SELECT attempts FROM diary_attempts WHERE bucket=?',[loginRole]))[0];
      if(attempt.attempts>10) return reply({error:'Too many tries. Please come back in 15 minutes.'},429,{'Retry-After':'900'});
      if(typeof body.password!=='string'||!matches(body.password,expected)) return reply({error:'That password isn’t quite right. Try again.'},401);
      const value=randomBytes(32).toString('hex');
      await execute('DELETE FROM diary_attempts WHERE bucket=?',[loginRole]);
      await execute('DELETE FROM diary_sessions WHERE expires<?',[now]);
      await execute('INSERT INTO diary_sessions (token,role,expires) VALUES (?,?,?)',[hash(value),loginRole,now+604800000]);
      return reply({ok:true},200,{'Set-Cookie':cookie(request,value,604800)});
    }
    if(body.action==='logout') {
      const value=token(request);if(value)await execute('DELETE FROM diary_sessions WHERE token=?',[hash(value)]);
      return reply({ok:true},200,{'Set-Cookie':cookie(request,'',0)});
    }
    if(await role(request)!=='admin') return reply({error:'Please sign in as admin.'},403);
    if(body.action==='save') {
      if(typeof body.drive!=='string') return reply({error:'Enter a Google Drive link.'},400);
      const drive=body.drive.trim();
      try { const url=new URL(drive);if(url.protocol!=='https:'||url.hostname!=='drive.google.com'||url.username||url.password||drive.length>2048)throw new Error(); }
      catch { return reply({error:'Use an https://drive.google.com/ link.'},400); }
      await execute('UPDATE diary_settings SET drive=? WHERE id=1',[drive]);
    } else if(body.action==='unlock'||body.action==='lock') {
      if(body.action==='unlock'&&!(await config()).drive) return reply({error:'Save your Google Drive link first.'},400);
      await execute('UPDATE diary_settings SET unlocked=? WHERE id=1',[body.action==='unlock'?1:0]);
    } else return reply({error:'Unknown action.'},400);
    const settings=await config();return reply({ok:true,drive:settings.drive,unlocked:!!settings.unlocked});
  } catch(error) { report(error);return reply({error:'Couldn’t save that. Please try again. If this continues, ask your boy to check the site settings.'},503); }
}
