/* The fun bits: floating points, confetti, banners, flashes and sound effects. */
import {SOUND_KEY} from '../../settings.js';
import {calm} from '../../helpers/page-helpers.js';

/* a "+30" that floats up from an element */
export function popup(text,from,kind='good'){const card=document.getElementById('stageCard');if(!card||!from)return;
  const a=from.getBoundingClientRect(),c=card.getBoundingClientRect(),p=document.createElement('span');
  p.className='g-pop '+kind;p.textContent=text;p.style.left=(a.left+a.width/2-c.left)+'px';p.style.top=(a.top-c.top)+'px';
  card.appendChild(p);setTimeout(()=>p.remove(),1100)}

/* a burst of confetti from the middle of an element */
export function confetti(from,count=24){if(calm())return;const card=document.getElementById('stageCard');if(!card||!from)return;
  const a=from.getBoundingClientRect(),c=card.getBoundingClientRect(),colours=['var(--accent)','var(--accent2)','var(--b3)','var(--green)','#facc15'];
  for(let i=0;i<count;i++){const s=document.createElement('i');s.className='g-confetti';
    const ang=Math.random()*Math.PI*2,dist=60+Math.random()*120;
    s.style.left=(a.left+a.width/2-c.left)+'px';s.style.top=(a.top+a.height/2-c.top)+'px';s.style.background=colours[i%colours.length];
    s.style.setProperty('--dx',Math.cos(ang)*dist+'px');s.style.setProperty('--dy',Math.sin(ang)*dist-40+'px');s.style.setProperty('--spin',(Math.random()*720-360)+'deg');
    card.appendChild(s);setTimeout(()=>s.remove(),1000)}}

/* a big message across the stage, e.g. "×2 combo!" or "Level 2" */
export function banner(text,kind=''){const card=document.getElementById('stageCard');if(!card)return;
  const b=document.createElement('div');b.className='g-banner '+kind;b.textContent=text;card.appendChild(b);setTimeout(()=>b.remove(),1300)}

/* restart a one-off CSS animation class, e.g. a red flash or a shake */
export function replay(el,cls){if(!el)return;el.classList.remove(cls);void el.offsetWidth;el.classList.add(cls)}

/* sound effects, made on the fly (no audio files); off until the player turns them on */
let audio=null;
export const soundOn=()=>{try{return localStorage.getItem(SOUND_KEY)==='on'}catch(e){return false}};
export const setSound=on=>{try{localStorage.setItem(SOUND_KEY,on?'on':'off')}catch(e){}};
const TUNES={right:[[660,.07],[880,.1]],wrong:[[220,.18,'sawtooth'],[180,.22,'sawtooth']],combo:[[523,.07],[659,.07],[784,.07],[1047,.14]],
  level:[[392,.09],[523,.09],[659,.09],[784,.2]],tick:[[1000,.03,'square']],go:[[784,.25]],count:[[440,.12]],
  end:[[523,.12],[392,.12],[330,.25]],best:[[523,.1],[659,.1],[784,.1],[1047,.1],[1319,.3]],match:[[740,.06],[988,.09]]};
export function sound(name){if(!soundOn()||!TUNES[name])return;
  try{audio=audio||new (window.AudioContext||window.webkitAudioContext)();let t=audio.currentTime;
    for(const [f,d,type='triangle'] of TUNES[name]){const o=audio.createOscillator(),g=audio.createGain();o.type=type;o.frequency.value=f;
      g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.15,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+d);
      o.connect(g).connect(audio.destination);o.start(t);o.stop(t+d+.02);t+=d*.85}}catch(e){}}
