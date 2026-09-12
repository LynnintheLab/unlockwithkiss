import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

// A new pathname prevents messaging apps from reusing the former For Mama image.
// Bump this route's version and the layout metadata together when the artwork changes.
// Only the owner-supplied public photograph is used here; no diary settings or secrets.
export const dynamic = 'force-static';
const size = { width: 1200, height: 630 };

export async function GET() {
  const photo = await readFile(join(process.cwd(), 'public/photos/hand-in-hand.jpg'));
  const src = `data:image/jpeg;base64,${photo.toString('base64')}`;
  return new ImageResponse(
    <div style={{display:'flex',width:'100%',height:'100%',background:'#ffda8c',color:'#352918'}}>
      <div style={{display:'flex',width:600,height:'100%',padding:'52px 48px',flexDirection:'column'}}>
        <div style={{display:'flex',alignItems:'center',gap:14,fontSize:30,fontWeight:700}}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#76521d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z"/></svg>
          <span>For AThel.</span>
        </div>
        <div style={{display:'flex',flexDirection:'column',marginTop:68,fontSize:58,fontWeight:700,lineHeight:1.15,letterSpacing:-2}}>
          <span>Even on the</span>
          <span>quiet days,</span>
          <span style={{color:'#76521d'}}>it’s still you.</span>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:14,marginTop:'auto',fontSize:22}}>
          <span>Little moments, saved just for you.</span>
          <span style={{fontSize:20,color:'#76521d'}}>always, your boy</span>
        </div>
      </div>
      <div style={{display:'flex',width:600,height:630,overflow:'hidden'}}>
        <img src={src} alt="Our hands held together" width={600} height={630} style={{objectFit:'cover',objectPosition:'42% center'}}/>
      </div>
    </div>,
    size,
  );
}
