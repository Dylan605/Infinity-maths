/* A maths keyboard that docks at the bottom of the screen whenever you type in a maths box. Each box chooses its keys
   with data-maths: integer, number, poly, expr or letters. On phones it replaces the phone keyboard. */

/* [what it shows, what it types, screen-reader name] */
const SYMBOLS={
  integer:[['−','−','minus']],
  number:[['√','√','square root'],['(','('],[')',')'],['/','/','fraction bar'],['^','^','to the power'],['<span class="mkb-box">□</span>²','²','squared'],['−','−','minus']],
  poly:[['x','x'],['x²','x²','x squared'],['x³','x³','x cubed'],['xⁿ','^','to the power'],['+','+','plus'],['−','−','minus']],
  expr:[['x','x'],['(','('],[')',')'],['^','^','to the power'],['<span class="mkb-box">□</span>²','²','squared'],['/','/','over'],['+','+','plus'],['−','−','minus']],
  letters:[['x','x'],['y','y'],['a','a'],['b','b'],['(','('],[')',')'],['^','^','to the power'],['+','+','plus'],['−','−','minus']],
};
const HAS_POINT={number:true,expr:true,letters:false,poly:false,integer:false};
const touch=()=>matchMedia('(pointer: coarse)').matches;

export function initMathsKeyboard(){
  const kb=document.createElement('div');kb.className='mkb';kb.hidden=true;kb.setAttribute('role','group');kb.setAttribute('aria-label','Maths keys');
  document.body.appendChild(kb);
  let target=null,watch=null;

  function render(kind){const sym=SYMBOLS[kind]||SYMBOLS.number;
    const cell=([show,types,name])=>`<button class="mkb-key sym" data-t="${types}"${name?` aria-label="${name}"`:''}>${show}</button>`;
    const symCells=[...sym.map(cell)];while(symCells.length%3)symCells.push('<span></span>');
    kb.innerHTML=`<div class="mkb-bar"><span>Maths keys</span><button class="mkb-hide" data-a="hide" aria-label="Hide the maths keys">▾</button></div>
      <div class="mkb-grid"><div class="mkb-syms">${symCells.join('')}</div>
        <div class="mkb-digits">${['7','8','9','4','5','6','1','2','3'].map(d=>`<button class="mkb-key" data-t="${d}">${d}</button>`).join('')}
          ${HAS_POINT[kind]?'<button class="mkb-key" data-t=".">.</button>':'<span></span>'}<button class="mkb-key" data-t="0">0</button><button class="mkb-key" data-a="del" aria-label="delete">⌫</button></div>
        <div class="mkb-side"><button class="mkb-key" data-a="left" aria-label="move left">◀</button><button class="mkb-key" data-a="right" aria-label="move right">▶</button>
          <button class="mkb-key done" data-a="done" aria-label="done">✓</button></div></div>`}

  function show(input){target=input;render(input.dataset.maths);kb.hidden=false;document.body.classList.add('mkb-open');
    document.documentElement.style.setProperty('--mkb-h',kb.offsetHeight+'px');
    // keep the box being typed in above the keyboard
    requestAnimationFrame(()=>{const r=input.getBoundingClientRect();if(r.bottom>innerHeight-kb.offsetHeight-12)input.scrollIntoView({block:'center',behavior:'smooth'})});
    // if the box disappears (a new question, a closed lesson), put the keyboard away
    watch?.disconnect();watch=new MutationObserver(()=>{if(!target?.isConnected)hide()});watch.observe(document.body,{childList:true,subtree:true})}
  function hide(){kb.hidden=true;target=null;watch?.disconnect();document.body.classList.remove('mkb-open')}

  const changed=()=>target.dispatchEvent(new Event('input',{bubbles:true}));
  function act(btn){if(!target?.isConnected)return hide();
    const t=target,a=t.selectionStart??t.value.length,b=t.selectionEnd??a;
    if(btn.dataset.t!==undefined){t.setRangeText(btn.dataset.t,a,b,'end');changed();return}
    const what=btn.dataset.a;
    if(what==='del'){if(a!==b)t.setRangeText('',a,b,'end');else if(a>0)t.setRangeText('',a-1,a,'end');changed()}
    else if(what==='left')t.setSelectionRange(Math.max(0,a-1),Math.max(0,a-1));
    else if(what==='right')t.setSelectionRange(Math.min(t.value.length,b+1),Math.min(t.value.length,b+1));
    else if(what==='done')t.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}));
    else if(what==='hide')hide()}

  // keys never take the focus away from the box being typed in
  kb.addEventListener('pointerdown',e=>e.preventDefault());
  kb.addEventListener('click',e=>{const btn=e.target.closest('button');if(btn)act(btn)});
  // on phones, stop the phone keyboard opening as well: set before the tap focuses the box
  document.addEventListener('pointerdown',e=>{const i=e.target.closest?.('input[data-maths]');if(i&&touch())i.inputMode='none'},true);
  document.addEventListener('focusin',e=>{const i=e.target.closest?.('input[data-maths]');if(i)show(i);else if(!kb.contains(e.target))hide()});
  document.addEventListener('click',e=>{const i=e.target.closest?.('input[data-maths]');if(i&&kb.hidden)show(i)});  // tapping the box again brings the keys back
  document.addEventListener('focusout',e=>{if(e.target===target&&!kb.contains(e.relatedTarget))setTimeout(()=>{if(document.activeElement!==target)hide()},0)});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&target&&e.target===target)hide()},true);
}
