'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { slides } from '@/lib/slides';

export function PhotoSlideshow({className='',label,startIndex=0,suspended=false}:{className?:string;label:string;startIndex?:number;suspended?:boolean}) {
  const [index,setIndex]=useState(startIndex);
  const [paused,setPaused]=useState(false);
  const [hovered,setHovered]=useState(false);
  const [focused,setFocused]=useState(false);
  const [reducedMotion,setReducedMotion]=useState(true);
  const [visible,setVisible]=useState(false);
  const [pageVisible,setPageVisible]=useState(true);
  const container=useRef<HTMLDivElement>(null);
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
    if(!playing||hovered||focused||suspended||!visible||!pageVisible)return;
    const timer=setInterval(()=>setIndex(i=>(i+1)%slides.length),5000);
    return()=>clearInterval(timer);
  },[playing,hovered,focused,suspended,visible,pageVisible]);
  function move(offset:number){setPaused(true);setIndex(i=>(i+offset+slides.length)%slides.length);}
  return <div ref={container} className={`photo-slideshow ${className}`} role="region" aria-roledescription="carousel" aria-label={label}
    onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
    onFocusCapture={()=>setFocused(true)} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))setFocused(false);}}>
    <div className="slide-stage" aria-live="off">
      {slides.map((slide,i)=>{
        const nearby=i===index||i===(index+1)%slides.length||i===(index+slides.length-1)%slides.length;
        return <img key={slide.src} className={`slide-photo${i===index?' is-active':''}`} src={nearby?slide.src:undefined}
          width={slide.width} height={slide.height} alt={i===index?slide.alt:''} aria-hidden={i!==index} decoding="async"/>;
      })}
    </div>
    <div className="slideshow-controls">
      <span className="slide-count" aria-live={paused?'polite':'off'} aria-atomic="true">{index+1} / {slides.length}</span>
      <div className="slide-buttons">
        <Button type="button" variant="ghost" size="icon" aria-label="Previous photo" onClick={()=>move(-1)}><ChevronLeft size={18}/></Button>
        {!reducedMotion&&<Button type="button" variant="ghost" size="icon" aria-label={paused?'Play slideshow':'Pause slideshow'} onClick={()=>setPaused(value=>!value)}>{paused?<Play size={16}/>:<Pause size={16}/>}</Button>}
        <Button type="button" variant="ghost" size="icon" aria-label="Next photo" onClick={()=>move(1)}><ChevronRight size={18}/></Button>
      </div>
    </div>
  </div>;
}
