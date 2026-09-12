'use client';

import { Dialog } from 'radix-ui';
import { ArrowRight, Heart, Play, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PhotoSlideshow } from '@/components/photo-slideshow';

const paragraphs = [
  'ဒီထဲက Video လေးတွေက အသဲစိတ်ဆိုးလို့ စကားမပြောတဲ့နေ့မှာ မောင် Video လေးရိုက်ထားပြီး မောင်ဘာလုပ်တယ် ဘာကိုင်တယ်ဆိုတာ အသဲမြင်ရအောင်လို့ ပြပေးထားတာနော် အသဲလေး...',
  'မောင် ဖုန်းသုံးဖို့လိုတဲ့အချိန် လောက်သာမရိုက်ဖြစ်ပေမယ့် အချိန်တော်တော်များများရိုက်ထားတာအသဲလေး...',
  'အသဲစိတ်ဆိုနေတော့ စကားမပြောဖြစ် မောင်ကလည်းလွမ်းတယ်... ဒါပေမယ့်လေ အခုလို Video လေးရိုက်ထားတော့ အသဲလေး မောင့်အနားမှာရှိနေသလိုပဲကွယ်...',
  'အသဲနဲ့ Video Call ပြောနေသလိုမျိုးလေး ခံစားချက်ရတာမလို့ မောင်လည်း လုပ်ထားဖြစ်သွားတာကွယ်...',
  'ဒါကတော့ အမှာစာလေးပေါ့နော်... သိပ်ချစ်တယ်ကွယ် <3',
];

export function DiaryNote({drive,open,onOpenChange}:{drive:string;open:boolean;onOpenChange:(value:boolean)=>void}) {
  return <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Trigger asChild><Button className="primary-button"><Play size={18}/>Open our little diary<ArrowRight size={18}/></Button></Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="note-overlay"/>
      <Dialog.Content className="diary-note" aria-describedby={undefined} onOpenAutoFocus={event=>{
        event.preventDefault();document.getElementById('diary-note-title')?.focus({preventScroll:true});
      }}>
        <Dialog.Close asChild><Button type="button" className="note-close" variant="ghost" size="icon" aria-label="Close note"><X size={20}/></Button></Dialog.Close>
        <aside className="note-photos">
          <PhotoSlideshow label="Photos beside your note" className="note-slideshow"/>
          <div className="note-photo-caption"><Heart size={16}/> One little corner. Just us two.</div>
        </aside>
        <div className="note-reading">
          <div className="note-heading">
            <span className="small-label">A little note, before you watch</span>
            <Dialog.Title id="diary-note-title" tabIndex={-1} className="note-title" lang="my">အသဲလေးအတွက်...</Dialog.Title>
          </div>
          <div className="note-message" lang="my">{paragraphs.map((paragraph,i)=><p key={i}>{paragraph}</p>)}</div>
          <div className="note-signature">always, your boy <Heart size={16}/></div>
          <Button asChild className="primary-button note-continue"><a href={drive} target="_blank" rel="noopener noreferrer"><Play size={18}/>Watch the videos<ArrowRight size={18}/></a></Button>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}
