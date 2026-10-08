/* Reads and works out a typed expression like 10C3 × 2^4, √(9/4) or (1/2)³, exactly where it can. Used by the calculator and to read typed answers. */
import {F,fadd,fdiv,fmul,fpow,fracRoot,fsub} from './fractions.js';
import {C} from './whole-numbers.js';

/* A value is an exact fraction {n, d} (BigInt) when it can be, otherwise an ordinary decimal number. */
export const isExact=v=>typeof v==='object';
export const asDecimal=v=>isExact(v)?Number(v.n)/Number(v.d):v;
const isWhole=v=>isExact(v)&&v.d===1n;
class CalcError extends Error{}
const fail=msg=>{throw new CalcError(msg)};
const checked=x=>Number.isFinite(x)?x:fail('That number is too big or not defined.');

const add=(a,b)=>isExact(a)&&isExact(b)?fadd(a,b):checked(asDecimal(a)+asDecimal(b));
const sub=(a,b)=>isExact(a)&&isExact(b)?fsub(a,b):checked(asDecimal(a)-asDecimal(b));
const mul=(a,b)=>isExact(a)&&isExact(b)?fmul(a,b):checked(asDecimal(a)*asDecimal(b));
function div(a,b){if(asDecimal(b)===0)fail("You can't divide by 0.");return isExact(a)&&isExact(b)?fdiv(a,b):checked(asDecimal(a)/asDecimal(b))}
function pow(b,e){
  if(isExact(b)&&isExact(e)&&e.d<=12n){
    if(b.n===0n&&e.n<0n)fail("0 can't be raised to a negative power.");
    if(e.n>2000n||e.n<-2000n)fail('That power is too big.');
    // a fractional power p/q is exact when the q-th root is a whole number or fraction, e.g. 8^(2/3) = 4
    const q=Number(e.d);let base=b;
    if(q>1){if(b.n<0n&&q%2===0)fail("A negative number has no even root.");const root=fracRoot(b,q);
      if(root)base=b.n<0n?fmul(root,F(-1)):root;
      else{const sign=b.n<0n&&e.n%2n!==0n?-1:1;return checked(sign*Math.abs(asDecimal(b))**(Number(e.n)/q))}}
    return fpow(base,Number(e.n))}
  const x=asDecimal(b)**asDecimal(e);return Number.isNaN(x)?fail('A negative number has no even root.'):checked(x)}
function factorial(v){if(!isWhole(v)||v.n<0n||v.n>1000n)fail('! needs a whole number from 0 to 1000.');let r=1n;for(let i=2n;i<=v.n;i++)r*=i;return F(r)}
function choose(n,r){if(!isWhole(n)||!isWhole(r)||r.n<0n||r.n>n.n||n.n>5000n)fail('nCr needs whole numbers with 0 ≤ r ≤ n.');return F(C(Number(n.n),Number(r.n)))}

/* the pieces of an expression: numbers, Ans, and the symbols + - * / ^ ! C ( ) √ */
function tokenize(text,shortcuts){
  const s=text.replace(/\s+/g,'').replace(/×/g,'*').replace(/÷/g,'/').replace(/[−–]/g,'-').replace(/\*\*/g,'^').replace(/ncr/gi,'C')
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g,sup=>'^'+[...sup].map(c=>'⁰¹²³⁴⁵⁶⁷⁸⁹'.indexOf(c)).join(''));  // x² → x^2
  if(!shortcuts&&/[Cc!]/.test(s))fail('Work out nCr and ! yourself here.');
  const out=[];let i=0;
  while(i<s.length){const rest=s.slice(i),num=rest.match(/^(\d+\.?\d*|\.\d+)/);
    if(num){out.push({num:num[0]});i+=num[0].length;continue}
    if(/^ans/i.test(rest)){out.push('ans');i+=3;continue}
    if('+-*/^!()√'.includes(s[i])||s[i]==='C'||s[i]==='c'){out.push(s[i]==='c'?'C':s[i]);i++;continue}
    fail(`I don't understand "${s[i]}".`)}
  return out}
const decimal=str=>{const [w,f='']=str.split('.');return F(BigInt((w||'0')+f),10n**BigInt(f.length))};

/* Works out an expression. Returns {value} or {error}. ans is the previous answer, used by "Ans".
   With shortcuts:false, nCr and ! are not allowed (for answers, so they still have to be worked out). */
export function calculate(text,ans,{shortcuts=true}={}){
  try{const t=tokenize(text,shortcuts);if(!t.length)return {error:''};let i=0;
    const peek=()=>t[i],take=()=>t[i++];
    const startsValue=x=>x!==undefined&&(x.num!==undefined||x==='ans'||x==='('||x==='√');
    // lowest priority first: + and −, then × and ÷ (a number next to a bracket multiplies), then a minus sign, nCr, powers, !
    const expr=()=>{let v=term();while(peek()==='+'||peek()==='-'){const op=take(),r=term();v=op==='+'?add(v,r):sub(v,r)}return v};
    const term=()=>{let v=signed();for(;;){const x=peek();
      if(x==='*'||x==='/'){take();const r=signed();v=x==='*'?mul(v,r):div(v,r)}else if(startsValue(x))v=mul(v,signed());else return v}};
    const signed=()=>peek()==='-'?(take(),sub(F(0),signed())):peek()==='+'?(take(),signed()):combos();
    const combos=()=>{let v=power();while(peek()==='C'){take();v=choose(v,power())}return v};
    const power=()=>{const b=postfix();if(peek()!=='^')return b;take();return pow(b,signed())};
    const postfix=()=>{let v=value();while(peek()==='!'){take();v=factorial(v)}return v};
    const value=()=>{const x=take();
      if(x===undefined)fail('The expression ends too soon.');
      if(x.num!==undefined)return decimal(x.num);
      if(x==='ans'){if(ans===undefined)fail('There is no answer yet for Ans.');return ans}
      if(x==='('){const v=expr();if(peek()===')')take();else if(peek()!==undefined)fail('A bracket is not closed.');return v}  // a missing ) at the very end is fine
      if(x==='√')return pow(postfix(),F(1,2));
      fail(`"${x==='*'?'×':x==='/'?'÷':x}" needs a number before it.`)};
    const v=expr();if(i<t.length)fail(t[i]===')'?'There is a ) without a matching (.':'Something is missing between the numbers.');
    return {value:v}}
  catch(e){if(e instanceof CalcError)return {error:e.message};throw e}}
