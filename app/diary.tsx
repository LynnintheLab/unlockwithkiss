'use client';
import { useEffect, useState } from 'react';
import { Heart, LockKeyhole, ArrowRight, ArrowLeft, Play, LogOut, Check, Link as LinkIcon, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PhotoSlideshow } from '@/components/photo-slideshow';
import { DiaryNote } from '@/components/diary-note';
type State={authenticated:boolean;role?:string;unlocked?:boolean;drive?:string};
export default function Diary({admin=false}:{admin?:boolean}) {
 const [noteOpen,setNoteOpen]=useState(false);
 const [state,setState]=useState<State>({authenticated:false});const [ready,setReady]=useState(false);const [step,setStep]=useState('question');const [mood,setMood]=useState('');const [password,setPassword]=useState('');const [drive,setDrive]=useState('');const [busy,setBusy]=useState(false);const [error,setError]=useState('');const [notice,setNotice]=useState('');
 useEffect(()=>{if(!state.authenticated||!state.unlocked)setNoteOpen(false);},[state.authenticated,state.unlocked]);
 async function refresh(){const res=await fetch('/api/diary',{cache:'no-store'});const data=await res.json() as State & {error?:string};if(!res.ok)throw new Error(data.error || "Please try again.");setState(data);return data as State;}
 useEffect(()=>{refresh().then(d=>setDrive(d.drive||'')).catch(e=>setError(e.message)).finally(()=>setReady(true));},[]);
 useEffect(()=>{if(!state.authenticated||admin)return;const timer=setInterval(()=>{refresh().then(()=>setError('')).catch(e=>setError(e.message));},5000);return()=>clearInterval(timer);},[state.authenticated,admin]);
 async function action(action:string){setBusy(true);setError('');setNotice('');try{const res=await fetch('/api/diary',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,password,drive,role:admin?'admin':'guest'})});const d=await res.json() as {error?:string};if(!res.ok)throw new Error(d.error);const next=await refresh();if(action==='login'){setPassword('');if(admin)setDrive(next.drive||'');}if(action==='logout'){setStep('question');setMood('');setPassword('');}if(action==='save')setNotice('Your link is saved.');if(action==='unlock')setNotice('Unlocked. Her page will update in a few seconds.');if(action==='lock')setNotice('The diary is locked again.');}catch(e){setError(e instanceof Error?e.message:'Something went wrong. Please try again.');}finally{setBusy(false);}}
 const loggedIn=state.authenticated&&(!admin||state.role==='admin');
 return <main className={admin?'site admin-site':'site'}>
  <header className="topbar"><a className="wordmark" href="/" aria-label="For AThel home"><Heart size={21} strokeWidth={1.5}/> For AThel<span className="wordmark-period">.</span></a><span className="top-note">{admin?'Just for your boy':'A little closer, even from here.'}</span>{loggedIn&&<Button variant="ghost" className="logout" onClick={()=>action('logout')} disabled={busy}><LogOut size={16}/><span>Sign out</span></Button>}</header>
  <div className="page-layout">
   <aside className="letter photo-letter">
    <PhotoSlideshow label="Our main photo memories" className="cover-slideshow" startSrc="/slideshow/moment-08.jpg" suspended={noteOpen}/>
    <div className="letter-copy">
     <span className="letter-label">{admin?'Behind the little moments':'A little piece of my day, for you'}</span>
     <h1>{admin?<>Made for her.<br/><em>Opened by you.</em></>:<>Even on the quiet days,<br/><em>it’s still you.</em></>}</h1>
     <p>{admin?'Your videos, one link, and the moment you let her in.':'I’m saving the little moments I wish I could tell you about. They’ll be right here, whenever you’re ready.'}</p>
     <div className="signature">{admin?'with a little help from love':'always, your boy'}<Heart size={17}/></div>
    </div>
   </aside>
   <section className="interaction" aria-label={admin?'Admin panel':'Your private diary'}>
    <div className="panel" key={!ready?'loading':admin?'admin':loggedIn?'diary':step}>
    {!ready?<><div className="symbol"><Heart/></div><h2>One little moment…</h2><p>Opening our corner.</p></>:admin&&loggedIn?<>
      <div className="panel-heading"><span className="small-label">Your little control room</span><span className="status"><LockKeyhole size={13}/>{state.unlocked?'Unlocked':'Locked'}</span></div><h2>For her, from you.</h2><p>Keep her daily videos in one Google Drive folder.</p>
      <form onSubmit={e=>{e.preventDefault();action('save');}} className="admin-form"><label htmlFor="drive">Google Drive link</label><Input id="drive" type="url" placeholder="https://drive.google.com/drive/folders/…" value={drive} onChange={e=>setDrive(e.target.value)}/><Button className="secondary-button" type="submit" disabled={busy}><LinkIcon size={17}/>{busy?'Saving…':'Save link'}</Button></form>
      <div className="unlock-section"><div className="symbol small"><Heart/></div><h3>{state.unlocked?'Her little diary is open.':'Got your big kiss?'}</h3><p>{state.unlocked?'She can open your videos after entering her password.':'When you’re ready, let her into your daily moments.'}</p><Button className="primary-button" disabled={busy} onClick={()=>action(state.unlocked?'lock':'unlock')}>{state.unlocked?<><LockKeyhole/>Lock the diary again</>:<><Heart/>Yes, unlock for her</>}</Button></div><a className="text-link" href="/" target="_blank" rel="noreferrer">See her page <ArrowRight size={15}/></a>
    </>:admin||(!loggedIn&&step==='password')?<>
      {!admin&&<Button variant="ghost" className="back" onClick={()=>{setStep('question');setError('');}}><ArrowLeft size={16}/>Back</Button>}<div className="symbol"><KeyRound size={30}/></div><span className="small-label">{admin?'For your eyes only':'A secret only we know'}</span><h2>{admin?'Hello, your boy.':'This part is just for you.'}</h2><p>{admin?'Sign in to save your link and open her diary.':mood==='angry'?'It’s okay. I’m still here, and I still made this for you.':'That made my day. There’s something here for you.'}</p><form onSubmit={e=>{e.preventDefault();action('login');}} className="login-form"><label htmlFor="password">{admin?'Admin password':'Our password'}</label><Input autoFocus id="password" type="password" autoComplete="current-password" inputMode={admin?'text':'numeric'} placeholder={admin?'Enter your admin password':'Enter our little secret'} value={password} onChange={e=>setPassword(e.target.value)} required/><Button className="primary-button" type="submit" disabled={busy||!password}>{busy?'Opening…':admin?'Sign in':'A little closer'}<ArrowRight size={18}/></Button></form>{!admin&&<span className="tiny-note"><LockKeyhole size={13}/> A private place for our little moments.</span>}
    </>:loggedIn?<>
      <div className="symbol">{state.unlocked?<Play size={32}/>:<Heart size={32}/>}</div><span className="small-label">{state.unlocked?'Every little moment, yours':'One last little thing'}</span><h2>{state.unlocked?'There you are, my love.':'Sealed with a kiss.'}</h2><p className="unlock-message">{state.unlocked?'The ordinary days. The things that made me smile. All the moments I wanted to share with you.':'To unlock, U need to give a big kiss to your boy'}</p>{state.unlocked&&state.drive?<DiaryNote drive={state.drive} open={noteOpen} onOpenChange={setNoteOpen}/>:state.unlocked?<p>Your boy is getting the videos ready. Come back soon.</p>:<><div className="waiting"><LockKeyhole size={16}/>Waiting for your boy to unlock it</div><span className="tiny-note">This page will open automatically when he does.</span></>}
    </>:<>
      <div className="symbol"><Heart size={34} strokeWidth={1.3}/></div><span className="small-label">Hey, my favorite person</span><h2 className="burmese" lang="my">စိတ်ဆိုးနေတုန်းလား?</h2><p>Before you come in, tell me one little thing.</p><div className="choices"><Button className="choice" onClick={()=>{setMood('angry');setStep('password');setError('');}}><span className="choice-icon">☁</span><span lang="my">ဆိုးနေတုန်းပဲ</span><ArrowRight size={17}/></Button><Button className="choice warm" onClick={()=>{setMood('happy');setStep('password');setError('');}}><Heart size={21}/><span lang="my">မဆိုးတော့ဘူး</span><ArrowRight size={17}/></Button></div><span className="tiny-note">Whatever your answer, this is still for you.</span>
    </>}
    {error&&<p className="feedback error" role="alert">{error}</p>}{notice&&<p className="feedback success" role="status"><Check size={16}/>{notice}</p>}
    </div><div className="under-panel"><Heart size={12}/> made with love, and a little missing you</div>
   </section>
  </div>
  {!admin&&<section className="memories" aria-label="Our little moments">
    <div className="memories-note"><span>One little corner.</span><span>Just us two.</span><Heart size={22} strokeWidth={1.3}/></div>
    <figure><img src="/photos/little-kindness.jpg" width="1086" height="724" loading="lazy" alt="Sharing a jacket on a breezy day in the hills."/><figcaption>It’s in the little things.</figcaption></figure>
    <figure><img src="/photos/hand-in-hand.jpg" width="1086" height="724" loading="lazy" alt="Our hands held together, with sheep grazing behind us."/><figcaption>And always, your hand in mine.</figcaption></figure>
  </section>}
  <footer><span>Little days. Big feelings.</span><span>Just for you ♡</span></footer>
 </main>;
}
