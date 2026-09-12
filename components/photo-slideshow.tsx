'use client';

import { useEffect, useRef, useState } from 'react';
import { slides } from '@/lib/slides';

export function PhotoSlideshow({className='',label,startSrc,suspended=false}:{className?:string;label:string;startSrc?:string;suspended?:boolean}) {
  const startIndex=Math.max(0,slides.findIndex(slide=>slide.src===startSrc));
  const [frame,setFrame]=useState({current:startIndex,previous:startIndex});
  const index=frame.current;
  const [paused,setPaused]=useState(false);
  const [hovered,setHovered]=useState(false);
  const [reducedMotion,setReducedMotion]=useState(true);
  const [visible,setVisible]=useState(false);
  const [pageVisible,setPageVisible]=useState(true);
  const container=useRef<HTMLDivElement>(null);
  const images=useRef<(HTMLImageElement|null)[]>([]);
  useEffect(()=>{
    const media=window.matchMedia('(prefers-reduced-motion: reduce)');
    const update=()=>setReducedMotion(media.matches);update();media.addEventListener('change',update);
    const visibility=()=>setPageVisible(!document.hidden);visibility();document.addEventListener('visibilitychange',visibility);
    const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{threshold:.1});
    if(container.current)observer.observe(container.current);
    return()=>{media.removeEventListener('change',update);document.removeEventListener('visibilitychange',visibility);observer.disconnect();};
  },[]);
  const playing=!paused&&!reducedMotion;
  useEffect(()=>{
    if(!playing||hovered||suspended||!visible||!pageVisible)return;
    const timer=setInterval(()=>setFrame(current=>{
      const next=(current.current+1)%slides.length;
      // Keep the current photograph visible until the next one has loaded.
      const image=images.current[next];
      return image?.complete&&image.naturalWidth>0?{current:next,previous:current.current}:current;
    }),6000);
    return()=>clearInterval(timer);
  },[playing,hovered,suspended,visible,pageVisible]);
  function move(offset:number){setPaused(true);setFrame(current=>({current:(current.current+offset+slides.length)%slides.length,previous:current.current}));}
  return <div ref={container} className={`photo-slideshow ${className}`} role="region" aria-roledescription="carousel" aria-label={label}
    tabIndex={0} aria-description="Press Space to pause or resume the slideshow. Use the arrow keys to browse photos."
    onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
    onFocus={()=>setPaused(true)} onKeyDown={event=>{
      if(event.key===' '){event.preventDefault();setPaused(value=>!value);}
      if(event.key==='ArrowLeft'){event.preventDefault();move(-1);}
      if(event.key==='ArrowRight'){event.preventDefault();move(1);}
    }}>
    <div className="slide-stage" aria-live="off">
      {slides.map((slide,i)=>{
        const nearby=i===index||i===frame.previous||i===(index+1)%slides.length||i===(index+slides.length-1)%slides.length;
        return <img key={slide.src} className={`slide-photo${i===index?' is-active':i===frame.previous?' was-active':''}`} src={nearby?slide.src:undefined}
          ref={image=>{images.current[i]=image;}} width={slide.width} height={slide.height} alt={i===index?slide.alt:''} aria-hidden={i!==index} decoding="async"/>;
      })}
    </div>
  </div>;
}
