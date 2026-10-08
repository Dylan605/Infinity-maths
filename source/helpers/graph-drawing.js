/* Draws graphs as SVG: grid, axes, curves, dashed lines (asymptotes, lines of symmetry), points and labels.
   Curves draw themselves in when shown; the colours follow the light or dark theme. */

let made=0;  // each graph needs its own clip-path id
const fmt=v=>String(+v.toFixed(6)).replace('-','−');
/* a tidy gap between grid lines: 1, 2 or 5 × a power of 10, giving about 6 to 12 lines */
function niceStep(range){const raw=range/9,p=10**Math.floor(Math.log10(raw)),m=raw/p;return (m<1.5?1:m<3.5?2:m<7.5?5:10)*p}
const esc=t=>String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

/* x, y: [lowest, highest] values shown.
   curves: [{f, from, to, colour (1, 2 or 3), dashed, label}]: f gives y for an x (NaN or ±Infinity where it isn't defined).
   lines: [{x} for x = a vertical line, {y} for horizontal, {m, c} for y = mx + c, with colour, dashed, label].
   points: [{x, y, label, open (an empty circle), at: where the label goes: 'ne', 'nw', 'se', 'sw', 'n', 's', 'e' or 'w'}].
   description: what the graph shows, for screen readers. */
export function graph({x:[x0,x1],y:[y0,y1],curves=[],lines=[],points=[],width=320,height=240,description='A graph',numbers=true}){
  const W=width,H=height,id='gclip'+(++made);
  const px=x=>(x-x0)/(x1-x0)*W,py=y=>H-(y-y0)/(y1-y0)*H;
  const out=[];
  // grid and axes
  const sx=niceStep(x1-x0),sy=niceStep(y1-y0);let grid='',nums='';
  for(let v=Math.ceil(x0/sx)*sx;v<=x1+1e-9;v+=sx){const X=px(v).toFixed(1);grid+=`M${X} 0V${H}`;
    if(numbers&&Math.abs(v)>1e-9&&px(v)>8&&px(v)<W-8)nums+=`<text x="${X}" y="${Math.min(H-3,Math.max(11,py(0)+12)).toFixed(1)}" text-anchor="middle">${fmt(v)}</text>`}
  for(let v=Math.ceil(y0/sy)*sy;v<=y1+1e-9;v+=sy){const Y=py(v).toFixed(1);grid+=`M0 ${Y}H${W}`;
    if(numbers&&Math.abs(v)>1e-9&&py(v)>8&&py(v)<H-6)nums+=`<text x="${Math.min(W-3,Math.max(3,px(0)-4)).toFixed(1)}" y="${(+Y+4).toFixed(1)}" text-anchor="${px(0)-4<14?'start':'end'}">${fmt(v)}</text>`}
  out.push(`<path class="g-grid" d="${grid}"/>`);
  const ax=Math.min(W,Math.max(0,px(0))),ay=Math.min(H,Math.max(0,py(0)));
  out.push(`<path class="g-axis" d="M0 ${ay.toFixed(1)}H${W}M${ax.toFixed(1)} 0V${H}"/>`,`<g class="g-num">${nums}</g>`,
    `<text class="g-axname" x="${W-4}" y="${(ay-6).toFixed(1)}" text-anchor="end">x</text><text class="g-axname" x="${(ax+6).toFixed(1)}" y="12">y</text>`);
  // dashed and straight lines
  for(const l of lines){let d,lx,ly;
    if(l.x!==undefined){const X=px(l.x).toFixed(1);d=`M${X} 0V${H}`;lx=+X+4;ly=14}
    else if(l.y!==undefined){const Y=py(l.y).toFixed(1);d=`M0 ${Y}H${W}`;lx=W-4;ly=+Y-5}
    else{d=`M0 ${py(l.m*x0+l.c).toFixed(1)}L${W} ${py(l.m*x1+l.c).toFixed(1)}`;lx=W-4;ly=py(l.m*x1+l.c)+(l.m>0?14:-6)}
    out.push(`<path class="g-line c${l.colour||3}${l.dashed===false?'':' dashed'}" d="${d}" clip-path="url(#${id})"/>`);
    if(l.label)out.push(`<text class="g-label c${l.colour||3}" x="${lx.toFixed(1)}" y="${Math.min(H-4,Math.max(12,ly)).toFixed(1)}" text-anchor="${l.x!==undefined?'start':'end'}">${esc(l.label)}</text>`)}
  // curves: sampled finely, broken where the curve jumps (an asymptote) or isn't defined
  for(const c of curves){const a=c.from??x0,b=c.to??x1,n=360;let d='',pen=false,prev=null,last=null;
    for(let i=0;i<=n;i++){const x=a+(b-a)*i/n,y=c.f(x),Y=py(y);
      if(!Number.isFinite(y)||Math.abs(Y)>H*20){pen=false;prev=null;continue}
      if(prev!==null&&Math.abs(Y-prev)>H*1.5)pen=false;  // a jump across an asymptote
      d+=(pen?'L':'M')+px(x).toFixed(1)+' '+Y.toFixed(1);pen=true;prev=Y;if(Y>=0&&Y<=H)last={X:px(x),Y}}
    out.push(`<path class="g-curve c${c.colour||1}${c.dashed?' dashed':''}" d="${d}" pathLength="1" clip-path="url(#${id})"/>`);
    if(c.label&&last)out.push(`<text class="g-label c${c.colour||1}" x="${Math.min(W-4,last.X).toFixed(1)}" y="${Math.min(H-6,Math.max(14,last.Y-8)).toFixed(1)}" text-anchor="end">${esc(c.label)}</text>`)}
  // points and their labels
  const OFF={n:[0,-10,'middle'],s:[0,18,'middle'],e:[9,4,'start'],w:[-9,4,'end'],ne:[7,-8,'start'],nw:[-7,-8,'end'],se:[7,16,'start'],sw:[-7,16,'end']};
  for(const p of points){const X=px(p.x),Y=py(p.y);if(X<-1||X>W+1||Y<-1||Y>H+1)continue;
    out.push(`<circle class="g-point${p.open?' open':''}" cx="${X.toFixed(1)}" cy="${Y.toFixed(1)}" r="4"/>`);
    if(p.label){const [dx,dy,anchor]=OFF[p.at||'ne'];out.push(`<text class="g-label" x="${Math.min(W-2,Math.max(2,X+dx)).toFixed(1)}" y="${Math.min(H-3,Math.max(11,Y+dy)).toFixed(1)}" text-anchor="${X+dx>W-60&&anchor==='start'?'end':anchor}">${esc(p.label)}</text>`)}}
  return `<figure class="graph"><svg viewBox="-1 -1 ${W+2} ${H+2}" role="img" aria-label="${esc(description)}"><defs><clipPath id="${id}"><rect x="0" y="0" width="${W}" height="${H}"/></clipPath></defs>${out.join('')}</svg></figure>`}
