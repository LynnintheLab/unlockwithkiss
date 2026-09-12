import { ImageResponse } from 'next/og';

// Public, static artwork only. Never read diary settings, sessions, or secrets here.
export const dynamic = 'force-static';
export const alt = 'For Mama. Even on the quiet days, it’s still you.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function PreviewImage() {
  return new ImageResponse(
    <div style={{display:'flex',width:'100%',height:'100%',background:'#ffda8c',color:'#352918',padding:'60px 72px',flexDirection:'column'}}>
      <div style={{display:'flex',alignItems:'center',gap:16,fontSize:32,fontWeight:700}}>
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#76521d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z"/></svg>
        <span>for mama.</span>
      </div>
      <div style={{display:'flex',flexDirection:'column',marginTop:58,fontSize:76,fontWeight:700,lineHeight:1.13,letterSpacing:-3}}>
        <span>Even on the quiet days,</span>
        <span style={{color:'#76521d'}}>it’s still you.</span>
      </div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:'auto',borderTop:'1px solid #b58c49',paddingTop:24,fontSize:25}}>
        <span>Little moments, saved just for you.</span>
        <span style={{fontSize:21}}>always, your boy</span>
      </div>
    </div>,
    size,
  );
}
