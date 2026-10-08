/* Question type: find f⁻¹(x) by writing y = f(x), swapping x and y and making y the subject: linear, (ax + b)/(cx + d), eˣ and ln. */
import {T,intField,mk,readLine,viewFor} from '../../question-list.js';
import {int} from '../../../../helpers/reading-input.js';
import {F,fadd,fdiv,fmul,fnum,fstr} from '../../../../helpers/fractions.js';
import {MINUS,sg} from '../../../../helpers/maths-display.js';
import {lin,par,shift,signed,terms,val} from '../../../../helpers/function-display.js';
import {graph} from '../../../../helpers/graph-drawing.js';
import {L,MC,Nm,newSteps} from '../../../../worked-solutions/building-blocks.js';
import {exprAns} from '../../../../maths/making-answers.js';
import {ri,rnz} from '../../../../helpers/random-numbers.js';

const X='<i>x</i>',Y='<i>y</i>',INV='<i>f</i><sup>−1</sup>',fr=(t,b)=>`<span class="fr"><span>${t}</span><span>${b}</span></span>`;
const ex=s=>`<i>e</i><sup>${s}</sup>`;
/* f in the letter v (x or y) */
function fH(P,v=X){const {kind}=P;
  if(kind==='lin')return lin(P.m,P.c,v);
  if(kind==='rat')return fr(terms([[P.a,v],[P.b,'']]),terms([[P.c,v],[P.d,'']]));
  if(kind==='exp')return ex(shift(P.h,v))+(P.k?' '+signed(P.k):'');
  return `ln(${shift(P.h,v)})`+(P.k?' '+signed(P.k):'')}
/* f⁻¹(x), simplified */
function invH(P){const {kind}=P;
  if(kind==='lin'){const {m,c}=P;if(m===1)return shift(c);if(m===-1)return terms([[c,''],[-1,X]]);return m>0?fr(shift(c),m):fr(terms([[c,''],[-1,X]]),-m)}
  if(kind==='rat')return fr(terms([[-P.d,X],[P.b,'']]),terms([[P.c,X],[-P.a,'']]));
  if(kind==='exp')return `ln(${shift(P.k)})`+(P.h?' '+signed(P.h):'');
  return ex(shift(P.k))+(P.h?' '+signed(P.h):'')}
const fNum=P=>({lin:x=>P.m*x+P.c,rat:x=>(P.a*x+P.b)/(P.c*x+P.d),exp:x=>Math.exp(x-P.h)+P.k,ln:x=>x>P.h?Math.log(x-P.h)+P.k:NaN})[P.kind];
const invNum=P=>({lin:x=>(x-P.c)/P.m,rat:x=>(P.b-P.d*x)/(P.c*x-P.a),exp:x=>x>P.k?Math.log(x-P.k)+P.h:NaN,ln:x=>Math.exp(x-P.k)+P.h})[P.kind];
const ratDomain=P=>`, ${X} ≠ ${val(F(-P.d,P.c))}`;
const plain=v=>sg(fstr(v));

T('inverse',{name:'Inverse functions',group:'composite',syllabus:{aa:'SL 2.5',ai:'AHL 2.7'},
  blurb:'f⁻¹ undoes f. Write y = f(x), swap x and y, and make y the subject.',
  help:'The function is f(x) = (ax + b)/(cx + d). Type a, b, c and d.',
  fields:[intField('a','a','2'),intField('b','b','1'),intField('c','c','1'),intField('d','d','-3')],
  parse(v){const n={};for(const k of ['a','b','c','d']){const r=int(v[k],-20,20,k);if(r.err)return r;n[k]=r.v}
    if(n.c===0)return {err:'c cannot be 0 here: then there is no x on the bottom.'};
    if(n.a*n.d===n.b*n.c)return {err:'With these numbers the top is a multiple of the bottom, so f is a constant and has no inverse.'};
    return {p:{t:'inverse',kind:'rat',...n}}},
  text:P=>`The function <i>f</i> is defined by <i>f</i>(${X}) = ${fH(P)}${P.kind==='rat'?ratDomain(P):P.kind==='ln'?`, for ${X} &gt; ${val(P.h)}`:''}. Find ${INV}(${X}).`,
  expr:P=>`<i>f</i>(${X}) = ${fH(P)}`,
  build(P){const {kind}=P,{steps,S}=newSteps(),f=fNum(P),g=invNum(P);
    S('Read the question','What is being asked?',[readLine(P,[`The <b>inverse function</b> ${INV} undoes <i>f</i>: if <i>f</i> takes 2 to 7, then ${INV} takes 7 back to 2. The −1 is not a power: ${INV}(${X}) is not 1 ÷ <i>f</i>(${X}).`]),
      L(`Plan: write ${Y} = <i>f</i>(${X}), swap ${X} and ${Y}, then make ${Y} the subject.`,'Swapping x and y swaps inputs and outputs, which is exactly what undoing means.',null,
        [`Every point (${X}, ${Y}) on the graph of <i>f</i> becomes the point (${Y}, ${X}) on the graph of ${INV}. Swapping the letters in the equation does the same thing.`])]);
    S('Swap x and y','Inputs become outputs.',[L(`${Y} = ${fH(P)}`,'Write the function with y.'),
      L(`${X} = ${fH(P,Y)}`,'Swap every x for y and every y for x.',MC('What is the next job?','make y the subject',['make x the subject','swap x and y back again','put x = 0'],'After swapping, solve for y: that y is f⁻¹(x).'))]);
    const rl=[];
    if(kind==='lin'){const {m,c}=P;
      if(c)rl.push(L(`${shift(c)} = ${lin(m,0,Y)}`,`${c>0?'Take away':'Add'} ${Math.abs(c)} on both sides.`,undefined,[`Undo the steps of <i>f</i> in reverse order: <i>f</i> multiplies by ${val(m)} and then adds ${val(c)}, so first take away ${val(c)}, then divide by ${val(m)}.`]));
      rl.push(L(`${Y} = ${invH(P)}`,m===1?'y is already on its own.':`Divide both sides by ${val(m)}.`,
        Nm(`Check your rule: what is f⁻¹(${sg(m+c)})?`,[{label:`f⁻¹(${sg(m+c)})`,answer:'1'}],`f(1) = ${sg(m+c)}, so f⁻¹(${sg(m+c)}) must be 1.`)))}
    else if(kind==='rat'){const {a,b,c,d}=P;
      rl.push(L(`${X}(${terms([[c,Y],[d,'']])}) = ${terms([[a,Y],[b,'']])}`,`Multiply both sides by the bottom, ${terms([[c,Y],[d,'']])}.`,undefined,[`This gets rid of the fraction. Keep the bracket: all of the bottom is multiplied by ${X}.`]),
        L(`${terms([[c,'<i>xy</i>'],[d,X]])} = ${terms([[a,Y],[b,'']])}`,'Expand the bracket.'),
        L(`${terms([[c,'<i>xy</i>'],[-a,Y]])} = ${terms([[-d,X],[b,'']])}`,'Get every term with y on the left, and everything else on the right.',
          MC('Why gather the y terms together?','so y can be taken out as a common factor',['to cancel the y terms','because x and y must be on opposite sides','to make the fraction simpler'],'y appears twice. Collecting both terms on one side lets us factorise y out, then divide.')),
        L(`${Y}(${terms([[c,X],[-a,'']])}) = ${terms([[-d,X],[b,'']])}`,'Factorise: take y out of both terms.',
          Nm(`The bracket is ${terms([[c,'x'],[-a,'']]).replace(/<[^>]+>/g,'')}. What is it equal to when x = 1?`,[{label:'value',answer:String(c-a)}],`${sg(c)} − (${sg(a)}) = ${sg(c-a)}.`)),
        L(`${Y} = ${invH(P)}`,`Divide both sides by the bracket.`,undefined,[`Notice the pattern: for (<i>ax</i> + <i>b</i>)/(<i>cx</i> + <i>d</i>), the inverse is (${MINUS}<i>dx</i> + <i>b</i>)/(<i>cx</i> ${MINUS} <i>a</i>): <i>a</i> and <i>d</i> swap places and change sign.`]))}
    else if(kind==='exp'){const {h,k}=P;
      if(k)rl.push(L(`${shift(k)} = ${ex(shift(h,Y))}`,`${k>0?'Take away':'Add'} ${Math.abs(k)} on both sides, to get the e part on its own.`));
      rl.push(L(`ln(${shift(k)}) = ${shift(h,Y)}`,'Take ln of both sides: ln undoes e.',MC('What undoes e to a power?','ln (the natural log)',['dividing by e','the square root','log base 10'],'ln is the inverse of e^x: ln(e^something) = something.'),
        [`ln(${ex('stuff')}) = stuff, because ln asks "what power of <i>e</i> gives this?".`]),
        L(`${Y} = ${invH(P)}`,h?`${h>0?'Add':'Take away'} ${Math.abs(h)} on both sides.`:'y is on its own.'))}
    else{const {h,k}=P;
      if(k)rl.push(L(`${shift(k)} = ln(${shift(h,Y)})`,`${k>0?'Take away':'Add'} ${Math.abs(k)} on both sides, to get the ln part on its own.`));
      rl.push(L(`${ex(shift(k))} = ${shift(h,Y)}`,'Raise e to the power of both sides: e undoes ln.',MC('What undoes ln?','e to the power',['multiplying by e','squaring','log base 10'],'e^(ln something) = something.'),
        [`<i>e</i><sup>ln(stuff)</sup> = stuff: <i>e</i> and ln undo each other.`]),
        L(`${Y} = ${invH(P)}`,h?`${h>0?'Add':'Take away'} ${Math.abs(h)} on both sides.`:'y is on its own.'))}
    S('Make y the subject','Undo what f does, one step at a time.',rl);
    let xs=[0,1,2,-1,3],x0=xs.find(x=>Number.isFinite(f(x))&&Math.abs(f(x)-Math.round(f(x)))<1e-9&&Number.isFinite(g(f(x))))??xs.find(x=>Number.isFinite(f(x))&&Number.isFinite(g(f(x))));
    if(kind==='exp')x0=P.h;if(kind==='ln')x0=P.h+1;
    const y0=kind==='rat'?fdiv(fadd(fmul(F(P.a),F(x0)),F(P.b)),fadd(fmul(F(P.c),F(x0)),F(P.d))):F(Math.round(f(x0)));
    const lo=kind==='rat'?Math.min(-P.d/P.c,P.a/P.c)-6:Math.min(kind==='lin'?-4:Math.min(P.h,P.k)-3,-1),hi=kind==='rat'?Math.max(-P.d/P.c,P.a/P.c)+6:Math.max(kind==='lin'?4:Math.max(P.h,P.k)+5,1);
    const v=kind==='lin'?viewFor([x0,fnum(y0),-4,4],[x0,fnum(y0),-4,4]):{x:[lo,hi],y:[lo,hi]};
    S('Check, and see it',`f(${x0}) = ${plain(y0)}, so ${INV}(${plain(y0)}) must be ${x0}.`,[
      L(`${INV}(${val(y0)}) = ${invH(P).replace(/(\d)<i>x<\/i>/g,`$1 × ${par(y0)}`).replace(/<i>x<\/i>/g,par(y0))} = ${val(x0)} ✓`,`f takes ${val(x0)} to ${val(y0)}, and ${INV} takes it back.`),
      L(graph({...v,curves:[{f,colour:1,label:'y = f(x)'},{f:g,colour:2,label:'y = f⁻¹(x)'}],lines:[{m:1,c:0,colour:3,label:'y = x'}],
        points:[{x:x0,y:fnum(y0),label:`(${sg(x0)}, ${plain(y0)})`,at:'nw'},{x:fnum(y0),y:x0,label:`(${plain(y0)}, ${sg(x0)})`,at:'se'}],description:'The graphs of f and its inverse, mirror images in the line y = x'}),
        `The graph of ${INV} is the graph of <i>f</i> reflected in the line ${Y} = ${X} (dashed).`,
        MC('The graph of f⁻¹ is the graph of f reflected in …','the line y = x',['the x-axis','the y-axis','the line y = −x'],'Swapping x and y reflects every point in the line y = x.'),
        [`Fold the page along the dashed line ${Y} = ${X}: the two graphs land on top of each other. Each marked point is the other one with its coordinates swapped.`])]);
    S('Final answer','Replace y with f⁻¹(x).',[L(`${INV}(${X}) = <span class="answer">${invH(P)}</span>`,
      kind==='exp'?`${INV} is only defined for ${X} &gt; ${val(P.k)}: the range of <i>f</i> becomes the domain of ${INV}.`:kind==='rat'?`${INV} is defined for ${X} ≠ ${val(F(P.a,P.c))}.`:'Check: f and f⁻¹ undo each other ✓')]);
    return mk(P,steps)},
  gen(lv=2){if(lv===1)return {t:'inverse',kind:'lin',m:ri(1,5),c:rnz(-9,9)};
    const pick=ri(0,3);
    if(lv===2&&pick===0)return {t:'inverse',kind:'lin',m:rnz(-6,-1),c:ri(-9,9)};
    if(lv===2||pick===0){let a,b,c,d;do{a=rnz(-5,5);b=rnz(-7,7);c=lv===2?1:ri(1,3);d=rnz(-6,6)}while(a*d===b*c);return {t:'inverse',kind:'rat',a,b,c,d}}
    return {t:'inverse',kind:pick%2?'exp':'ln',h:ri(-4,4),k:rnz(-4,4)}},
  ans:P=>exprAns(invNum(P),invH(P)),
  hints:P=>['Write y = f(x).','Swap x and y.',P.kind==='rat'?'Multiply by the bottom, collect the y terms, take y out as a factor, then divide.':P.kind==='exp'?'Get the e part on its own, then take ln of both sides.':P.kind==='ln'?'Get the ln part on its own, then raise e to the power of both sides.':'Make y the subject: undo the adding, then the multiplying.'],
  example:{t:'inverse',kind:'rat',a:2,b:1,c:1,d:-3}});
