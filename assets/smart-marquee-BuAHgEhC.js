import{r as u,j as S,o as W,l as ne,p as _,g as Z,R as re,q as oe,v as se,a as I}from"./index-BnCywg3m.js";function pe(t,e,{checkForDefaultPrevented:c=!0}={}){return function(a){if(t==null||t(a),c===!1||!a.defaultPrevented)return e==null?void 0:e(a)}}function ce(t,e=[]){let c=[];function i(r,n){const o=u.createContext(n),l=c.length;c=[...c,n];const m=f=>{var x;const{scope:s,children:v,...C}=f,h=((x=s==null?void 0:s[t])==null?void 0:x[l])||o,p=u.useMemo(()=>C,Object.values(C));return S.jsx(h.Provider,{value:p,children:v})};m.displayName=r+"Provider";function d(f,s){var h;const v=((h=s==null?void 0:s[t])==null?void 0:h[l])||o,C=u.useContext(v);if(C)return C;if(n!==void 0)return n;throw new Error(`\`${f}\` must be used within \`${r}\``)}return[m,d]}const a=()=>{const r=c.map(n=>u.createContext(n));return function(o){const l=(o==null?void 0:o[t])||r;return u.useMemo(()=>({[`__scope${t}`]:{...o,[t]:l}}),[o,l])}};return a.scopeName=t,[i,ae(a,...e)]}function ae(...t){const e=t[0];if(t.length===1)return e;const c=()=>{const i=t.map(a=>({useScope:a(),scopeName:a.scopeName}));return function(r){const n=i.reduce((o,{useScope:l,scopeName:m})=>{const f=l(r)[`__scope${m}`];return{...o,...f}},{});return u.useMemo(()=>({[`__scope${e.scopeName}`]:n}),[n])}};return c.scopeName=e.scopeName,c}var ie=["a","button","div","form","h2","h3","img","input","label","li","nav","ol","p","select","span","svg","ul"],we=ie.reduce((t,e)=>{const c=W(`Primitive.${e}`),i=u.forwardRef((a,r)=>{const{asChild:n,...o}=a,l=n?c:e;return typeof window<"u"&&(window[Symbol.for("radix-ui")]=!0),S.jsx(l,{...o,ref:r})});return i.displayName=`Primitive.${e}`,{...t,[e]:i}},{});function ye(t,e){t&&ne.flushSync(()=>t.dispatchEvent(e))}function xe(t){const e=t+"CollectionProvider",[c,i]=ce(e),[a,r]=c(e,{collectionRef:{current:null},itemMap:new Map}),n=h=>{const{scope:p,children:x}=h,w=_.useRef(null),g=_.useRef(new Map).current;return S.jsx(a,{scope:p,itemMap:g,collectionRef:w,children:x})};n.displayName=e;const o=t+"CollectionSlot",l=W(o),m=_.forwardRef((h,p)=>{const{scope:x,children:w}=h,g=r(o,x),b=Z(p,g.collectionRef);return S.jsx(l,{ref:b,children:w})});m.displayName=o;const d=t+"CollectionItemSlot",f="data-radix-collection-item",s=W(d),v=_.forwardRef((h,p)=>{const{scope:x,children:w,...g}=h,b=_.useRef(null),q=Z(p,b),R=r(d,x);return _.useEffect(()=>(R.itemMap.set(b,{ref:b,...g}),()=>void R.itemMap.delete(b))),S.jsx(s,{[f]:"",ref:q,children:w})});v.displayName=d;function C(h){const p=r(t+"CollectionConsumer",h);return _.useCallback(()=>{const w=p.collectionRef.current;if(!w)return[];const g=Array.from(w.querySelectorAll(`[${f}]`));return Array.from(p.itemMap.values()).sort((R,O)=>g.indexOf(R.ref.current)-g.indexOf(O.ref.current))},[p.collectionRef,p.itemMap])}return[{Provider:n,Slot:m,ItemSlot:v},C,i]}var le=u.createContext(void 0);function Se(t){const e=u.useContext(le);return t||e||"ltr"}var J=globalThis!=null&&globalThis.document?u.useLayoutEffect:()=>{};function Ce(t){const[e,c]=u.useState(void 0);return J(()=>{if(t){c({width:t.offsetWidth,height:t.offsetHeight});const i=new ResizeObserver(a=>{if(!Array.isArray(a)||!a.length)return;const r=a[0];let n,o;if("borderBoxSize"in r){const l=r.borderBoxSize,m=Array.isArray(l)?l[0]:l;n=m.inlineSize,o=m.blockSize}else n=t.offsetWidth,o=t.offsetHeight;c({width:n,height:o})});return i.observe(t,{box:"border-box"}),()=>i.unobserve(t)}else c(void 0)},[t]),e}var ue=re[" useInsertionEffect ".trim().toString()]||J;function ge({prop:t,defaultProp:e,onChange:c=()=>{},caller:i}){const[a,r,n]=fe({defaultProp:e,onChange:c}),o=t!==void 0,l=o?t:a;{const d=u.useRef(t!==void 0);u.useEffect(()=>{const f=d.current;f!==o&&console.warn(`${i} is changing from ${f?"controlled":"uncontrolled"} to ${o?"controlled":"uncontrolled"}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`),d.current=o},[o,i])}const m=u.useCallback(d=>{var f;if(o){const s=de(d)?d(t):d;s!==t&&((f=n.current)==null||f.call(n,s))}else r(d)},[o,t,r,n]);return[l,m]}function fe({defaultProp:t,onChange:e}){const[c,i]=u.useState(t),a=u.useRef(c),r=u.useRef(e);return ue(()=>{r.current=e},[e]),u.useEffect(()=>{var n;a.current!==c&&((n=r.current)==null||n.call(r,c),a.current=c)},[c,a]),[c,i,r]}function de(t){return typeof t=="function"}var k={},G;function me(){if(G)return k;G=1;function t(r){if(typeof window>"u")return;const n=document.createElement("style");return n.setAttribute("type","text/css"),n.innerHTML=r,document.head.appendChild(n),r}Object.defineProperty(k,"__esModule",{value:!0});var e=oe();function c(r){return r&&typeof r=="object"&&"default"in r?r:{default:r}}var i=c(e);t(`.rfm-marquee-container {
  overflow-x: hidden;
  display: flex;
  flex-direction: row;
  position: relative;
  width: var(--width);
  transform: var(--transform);
}
.rfm-marquee-container:hover div {
  animation-play-state: var(--pause-on-hover);
}
.rfm-marquee-container:active div {
  animation-play-state: var(--pause-on-click);
}

.rfm-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
}
.rfm-overlay::before, .rfm-overlay::after {
  background: linear-gradient(to right, var(--gradient-color), rgba(255, 255, 255, 0));
  content: "";
  height: 100%;
  position: absolute;
  width: var(--gradient-width);
  z-index: 2;
  pointer-events: none;
  touch-action: none;
}
.rfm-overlay::after {
  right: 0;
  top: 0;
  transform: rotateZ(180deg);
}
.rfm-overlay::before {
  left: 0;
  top: 0;
}

.rfm-marquee {
  flex: 0 0 auto;
  min-width: var(--min-width);
  z-index: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  animation: scroll var(--duration) linear var(--delay) var(--iteration-count);
  animation-play-state: var(--play);
  animation-delay: var(--delay);
  animation-direction: var(--direction);
}
@keyframes scroll {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-100%);
  }
}

.rfm-initial-child-container {
  flex: 0 0 auto;
  display: flex;
  min-width: auto;
  flex-direction: row;
  align-items: center;
}

.rfm-child {
  transform: var(--transform);
}`);const a=e.forwardRef(function({style:n={},className:o="",autoFill:l=!1,play:m=!0,pauseOnHover:d=!1,pauseOnClick:f=!1,direction:s="left",speed:v=50,delay:C=0,loop:h=0,gradient:p=!1,gradientColor:x="white",gradientWidth:w=200,onFinish:g,onCycleComplete:b,onMount:q,children:R},O){const[$,Q]=e.useState(0),[z,Y]=e.useState(0),[A,B]=e.useState(1),[D,F]=e.useState(!1),H=e.useRef(null),E=O||H,P=e.useRef(null),j=e.useCallback(()=>{if(P.current&&E.current){const y=E.current.getBoundingClientRect(),T=P.current.getBoundingClientRect();let M=y.width,N=T.width;(s==="up"||s==="down")&&(M=y.height,N=T.height),B(l&&M&&N&&N<M?Math.ceil(M/N):1),Q(M),Y(N)}},[l,E,s]);e.useEffect(()=>{if(D&&(j(),P.current&&E.current)){const y=new ResizeObserver(()=>j());return y.observe(E.current),y.observe(P.current),()=>{y&&y.disconnect()}}},[j,E,D]),e.useEffect(()=>{j()},[j,R]),e.useEffect(()=>{F(!0)},[]),e.useEffect(()=>{typeof q=="function"&&q()},[]);const U=e.useMemo(()=>l?z*A/v:z<$?$/v:z/v,[l,$,z,A,v]),ee=e.useMemo(()=>Object.assign(Object.assign({},n),{"--pause-on-hover":!m||d?"paused":"running","--pause-on-click":!m||d&&!f||f?"paused":"running","--width":s==="up"||s==="down"?"100vh":"100%","--transform":s==="up"?"rotate(-90deg)":s==="down"?"rotate(90deg)":"none"}),[n,m,d,f,s]),te=e.useMemo(()=>({"--gradient-color":x,"--gradient-width":typeof w=="number"?`${w}px`:w}),[x,w]),X=e.useMemo(()=>({"--play":m?"running":"paused","--direction":s==="left"?"normal":"reverse","--duration":`${U}s`,"--delay":`${C}s`,"--iteration-count":h?`${h}`:"infinite","--min-width":l?"auto":"100%"}),[m,s,U,C,h,l]),L=e.useMemo(()=>({"--transform":s==="up"?"rotate(90deg)":s==="down"?"rotate(-90deg)":"none"}),[s]),V=e.useCallback(y=>[...Array(Number.isFinite(y)&&y>=0?y:0)].map((T,M)=>i.default.createElement(e.Fragment,{key:M},e.Children.map(R,N=>i.default.createElement("div",{style:L,className:"rfm-child"},N)))),[L,R]);return D?i.default.createElement("div",{ref:E,style:ee,className:"rfm-marquee-container "+o},p&&i.default.createElement("div",{style:te,className:"rfm-overlay"}),i.default.createElement("div",{className:"rfm-marquee",style:X,onAnimationIteration:b,onAnimationEnd:g},i.default.createElement("div",{className:"rfm-initial-child-container",ref:P},e.Children.map(R,y=>i.default.createElement("div",{style:L,className:"rfm-child"},y))),V(A-1)),i.default.createElement("div",{className:"rfm-marquee",style:X},V(A))):null});return k.default=a,k}var ve=me();const K=se(ve);function be(t){const{children:e,className:c,wrapperClassName:i,onClick:a,autoPlay:r=!1}=t,n=u.useRef(null),[o,l]=u.useState(!1),[m,d]=u.useState(!1),f=u.useCallback(()=>{if(n.current){const{scrollWidth:s,clientWidth:v}=n.current;l(s>v)}},[]);return u.useLayoutEffect(()=>(f(),window.addEventListener("resize",f),()=>{window.removeEventListener("resize",f)}),[f]),S.jsx("div",{onClick:a,role:a?"button":void 0,className:I("h-min w-auto overflow-hidden",i),onMouseEnter:()=>d(!0),onMouseLeave:()=>d(!1),children:o?S.jsx(K,{play:m||r,className:"[&_.rfm-child]:mr-3 [&_.rfm-child]:leading-tight",children:e}):S.jsx("p",{ref:n,className:I("overflow-hidden leading-tight whitespace-nowrap",c),children:e})})}function Re(t){const{children:e,className:c,wrapperClassName:i,onClick:a,autoPlay:r=!1}=t,n=u.useRef(null),[o,l]=u.useState(!1),[m,d]=u.useState(!1),f=u.useCallback(()=>{if(n.current){const{scrollWidth:s,clientWidth:v}=n.current;console.log(s>v,s,v),l(s>v)}},[]);return u.useLayoutEffect(()=>{console.log("checking on layout effect"),f()},[f,e]),S.jsxs("div",{onClick:a,role:a?"button":void 0,className:I("relative h-min w-auto overflow-hidden",i),onMouseEnter:()=>d(!0),onMouseLeave:()=>d(!1),children:[S.jsx("p",{ref:n,className:I("absolute top-0 w-full overflow-hidden leading-tight whitespace-nowrap",o&&"opacity-0",c),children:e}),S.jsx(K,{play:m||r,className:I("[&_.rfm-child]:mr-3 [&_.rfm-child]:leading-tight",!o&&"pointer-events-none opacity-0"),children:e})]})}export{Re as B,we as P,be as S,ge as a,pe as b,ce as c,xe as d,Ce as e,ye as f,J as g,Se as u};
