/* A calculator that slides out from the right-hand edge of every page (hidden during revision games). */
import {CALC_HISTORY_SIZE} from '../settings.js';
import {asDecimal,calculate,isExact} from '../maths/calculator-maths.js';
import {ff,fh,sg} from '../helpers/maths-display.js';

/* [label, what it types (or an action), extra class, screen-reader name] */
const KEYS=[['nCr','C','fn','n choose r'],['x!','!','fn','factorial'],['xʸ','^','fn','to the power'],['x²','^2','fn','squared'],['√','√(','fn','square root'],
  ['7','7'],['8','8'],['9','9'],['(','('],[')',')'],
  ['4','4'],['5','5'],['6','6'],['×','×','op','times'],['÷','÷','op','divide'],
  ['1','1'],['2','2'],['3','3'],['+','+','op','plus'],['−','−','op','minus'],
  ['0','0'],['.','.'],['Ans','Ans','fn','previous answer'],['⌫','@del','fn','delete'],['AC','@clear','fn','clear'],
  ['S⇔D','@toggle','fn wide','fraction or decimal'],['=','@equals','eq wider','equals']];

export function initCalculator(){
  const wrap=document.createElement('div');wrap.className='calc-wrap';
  wrap.innerHTML=`<button class="calc-handle" id="calcHandle" aria-expanded="false" aria-controls="calc"><span aria-hidden="true">🧮</span><span class="calc-handle-label">Calculator</span></button>
    <aside class="calc" id="calc" aria-label="Calculator">
      <div class="calc-head"><h2>Calculator</h2><button class="calc-close" id="calcClose" aria-label="Close the calculator">✕</button></div>
      <div class="calc-screen">
        <input class="calc-input" id="calcIn" inputmode="none" autocomplete="off" spellcheck="false" placeholder="e.g. 10C3 × 2^4" aria-label="Calculation">
        <div class="calc-out" id="calcOut" aria-live="polite"></div>
      </div>
      <div class="calc-keys">${KEYS.map(([label,does,cls='',name])=>`<button class="calc-key ${cls}" data-k="${does}"${name?` aria-label="${name}"`:''}>${label}</button>`).join('')}</div>
      <div class="calc-history"><h3>History</h3><ol id="calcHist"><li class="calc-empty">Your calculations will appear here. Tap one to use it again.</li></ol></div>
    </aside>`;
  document.body.appendChild(wrap);
  const $=id=>wrap.querySelector('#'+id),input=$('calcIn'),out=$('calcOut'),hist=$('calcHist');
  let ans,result=null,asDec=false,justDone=false;const history=[];

  const esc=t=>t.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
  const show=v=>isExact(v)&&!asDec?(v.d===1n?group(sg(v.n)):fh(v)):sg(ff(asDecimal(v),10));
  const group=t=>t.replace(/\B(?=(\d{3})+(?!\d))/g,' ');  // thin spaces in long numbers: 2 432 902 …
  const fit=()=>out.classList.toggle('long',out.textContent.length>16);  // long answers get smaller so they fit
  function preview(){justDone=false;result=null;const r=calculate(input.value,ans);
    out.className='calc-out preview';out.innerHTML=r.value!==undefined?'= '+show(r.value):'';fit()}
  function equals(){const text=input.value.trim();if(!text)return;const r=calculate(text,ans);
    if(r.error!==undefined){out.className='calc-out error';out.textContent=r.error;out.classList.remove('shake');void out.offsetWidth;out.classList.add('shake');return}
    ans=r.value;result=r.value;justDone=true;asDec=false;out.className='calc-out done';out.innerHTML='= '+show(r.value);fit();
    history.unshift({text,value:r.value});history.length=Math.min(history.length,CALC_HISTORY_SIZE);
    hist.innerHTML=history.map((h,i)=>`<li><button data-h="${i}"><span class="calc-h-q">${esc(h.text)}</span><span class="calc-h-a">= ${show(h.value)}</span></button></li>`).join('')}
  function type(t){
    // after "=", an operator carries on from the answer; anything else starts a new calculation
    if(justDone){input.value=/^[+−×÷^!C]/.test(t)?'Ans':'';justDone=false}
    const a=input.selectionStart??input.value.length,b=input.selectionEnd??a;
    input.setRangeText(t,a,b,'end');input.focus({preventScroll:true});preview()}
  function press(k){
    if(k==='@equals')return equals();
    if(k==='@clear'){input.value='';out.innerHTML='';justDone=false;result=null;return input.focus({preventScroll:true})}
    if(k==='@del'){if(justDone){input.value='';out.innerHTML='';justDone=false;return}
      const a=input.selectionStart??input.value.length,b=input.selectionEnd??a;
      if(a===b&&a>0)input.setRangeText('',a-(input.value.slice(a-3,a)==='Ans'?3:1),a,'end');else input.setRangeText('',a,b,'end');input.focus({preventScroll:true});return preview()}
    if(k==='@toggle'){if(result&&isExact(result)){asDec=!asDec;out.innerHTML='= '+show(result);fit()}return}
    type(k)}

  wrap.querySelector('.calc-keys').addEventListener('click',e=>{const b=e.target.closest('[data-k]');if(b)press(b.dataset.k)});
  hist.addEventListener('click',e=>{const b=e.target.closest('[data-h]');if(!b)return;input.value=history[+b.dataset.h].text;input.focus({preventScroll:true});preview()});
  input.addEventListener('input',preview);
  input.addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Enter'||e.key==='='){e.preventDefault();equals()}else if(e.key==='Escape')toggle(false)});

  const panel=$('calc'),handle=$('calcHandle');panel.inert=true;
  function toggle(open=!wrap.classList.contains('open')){wrap.classList.toggle('open',open);panel.inert=!open;handle.setAttribute('aria-expanded',open);
    if(open)setTimeout(()=>input.focus({preventScroll:true}),250);else handle.focus({preventScroll:true})}
  handle.onclick=()=>toggle();$('calcClose').onclick=()=>toggle(false);
}
