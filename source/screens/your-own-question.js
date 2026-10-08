/* The "Your own question" form: pick a type, type the question, watch it solved. */
import {openBook} from '../notebook/notebook.js';
import {getTopic} from './current-topic.js';
import {$} from '../helpers/page-helpers.js';
import {inCourse} from './study-settings.js';

export function makeBuilder(cid,pre,defG){
  const root=$(cid);
  const optsHtml=()=>getTopic().groups.map(([g,label])=>`<optgroup label="${label}">${Object.values(getTopic().types).filter(t=>t.group===g&&t.parse&&inCourse(t)).map(t=>`<option value="${t.id}">${t.name}</option>`).join('')}</optgroup>`).join('');
  root.innerHTML=`<label class="blab">What does the question ask?<select id="${pre}type">${optsHtml()}</select></label>
    <p class="hint" id="${pre}help"></p>
    <div class="bfields" id="${pre}fields"></div>
    <div class="preview" id="${pre}prev"></div>
    <p class="err" id="${pre}err" hidden></p>
    <div class="rowb">${defG?'':`<button class="btn primary" id="${pre}watch">Watch it solved</button>`}<button class="btn ${defG?'primary':''}" id="${pre}guided">Try it myself</button></div>`;
  const sel=$(pre+'type');
  const read=()=>{const t=getTopic().types[sel.value],v={};t.fields.forEach(f=>v[f.id]=$(pre+'f_'+f.id).value);return v};
  const parse=()=>{const t=getTopic().types[sel.value];return t.parse(read())};
  const preview=()=>{const r=parse(),err=$(pre+'err');
    if(r.err!==undefined){$(pre+'prev').innerHTML='';err.hidden=!r.err;err.textContent=r.err;return null}
    err.hidden=true;$(pre+'prev').innerHTML=getTopic().types[r.p.t].text(r.p);return r.p};
  const renderFields=()=>{const t=getTopic().types[sel.value];$(pre+'help').textContent=t.help;
    $(pre+'fields').innerHTML=t.fields.map(f=>f.kind==='sel'
      ?`<label>${f.label}<select id="${pre}f_${f.id}">${f.opts.map(([v,l])=>`<option value="${v}">${l}</option>`).join('')}</select></label>`
      :`<label class="${f.kind==='expr'||f.kind==='text'?'wide':''}">${f.label}<input type="text" id="${pre}f_${f.id}" value="${f.def}" data-maths="${f.keys||{int:'integer',expr:'expr',text:'expr'}[f.kind]}" ${f.kind==='int'?'inputmode="numeric"':''} autocomplete="off"></label>`).join('');
    t.fields.forEach(f=>{const el=$(pre+'f_'+f.id);if(f.kind==='sel')el.value=f.def;el.addEventListener('input',preview);el.addEventListener('change',preview);
      el.addEventListener('keydown',e=>{if(e.key==='Enter')start(defG)})});preview()};
  const start=g=>{const P=preview();if(!P)return;openBook(getTopic().types[P.t].build(P),g)};
  sel.addEventListener('change',renderFields);
  if(!defG)$(pre+'watch').onclick=()=>start(false);
  $(pre+'guided').onclick=()=>start(true);
  renderFields();
  // the list of question types follows the topic and the course (SL leaves out the HL-only types)
  const refill=()=>{const keep=sel.value;sel.innerHTML=optsHtml();if([...sel.options].some(o=>o.value===keep))sel.value=keep;if(sel.value)renderFields()};
  document.addEventListener('studychange',refill);document.addEventListener('topicchange',refill);
}
