import{U as Y,W as F,r as i,j as p,g as E}from"./index-HwXstorI.js";var S={},I;function ee(){if(I)return S;I=1;function y(r){if(typeof window>"u")return;const n=document.createElement("style");return n.setAttribute("type","text/css"),n.innerHTML=r,document.head.appendChild(n),r}Object.defineProperty(S,"__esModule",{value:!0});var e=Y();function g(r){return r&&typeof r=="object"&&"default"in r?r:{default:r}}var s=g(e);y(`.rfm-marquee-container {
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
}`);const d=e.forwardRef(function({style:n={},className:w="",autoFill:l=!1,play:u=!0,pauseOnHover:c=!1,pauseOnClick:o=!1,direction:t="left",speed:f=50,delay:L=0,loop:j=0,gradient:X=!1,gradientColor:z="white",gradientWidth:q=200,onFinish:H,onCycleComplete:T,onMount:B,children:M},U){const[C,Z]=e.useState(0),[N,G]=e.useState(0),[R,O]=e.useState(1),[_,J]=e.useState(!1),K=e.useRef(null),m=U||K,x=e.useRef(null),b=e.useCallback(()=>{if(x.current&&m.current){const a=m.current.getBoundingClientRect(),W=x.current.getBoundingClientRect();let h=a.width,v=W.width;(t==="up"||t==="down")&&(h=a.height,v=W.height),O(l&&h&&v&&v<h?Math.ceil(h/v):1),Z(h),G(v)}},[l,m,t]);e.useEffect(()=>{if(_&&(b(),x.current&&m.current)){const a=new ResizeObserver(()=>b());return a.observe(m.current),a.observe(x.current),()=>{a&&a.disconnect()}}},[b,m,_]),e.useEffect(()=>{b()},[b,M]),e.useEffect(()=>{J(!0)},[]),e.useEffect(()=>{typeof B=="function"&&B()},[]);const $=e.useMemo(()=>l?N*R/f:N<C?C/f:N/f,[l,C,N,R,f]),Q=e.useMemo(()=>Object.assign(Object.assign({},n),{"--pause-on-hover":!u||c?"paused":"running","--pause-on-click":!u||c&&!o||o?"paused":"running","--width":t==="up"||t==="down"?"100vh":"100%","--transform":t==="up"?"rotate(-90deg)":t==="down"?"rotate(90deg)":"none"}),[n,u,c,o,t]),V=e.useMemo(()=>({"--gradient-color":z,"--gradient-width":typeof q=="number"?`${q}px`:q}),[z,q]),A=e.useMemo(()=>({"--play":u?"running":"paused","--direction":t==="left"?"normal":"reverse","--duration":`${$}s`,"--delay":`${L}s`,"--iteration-count":j?`${j}`:"infinite","--min-width":l?"auto":"100%"}),[u,t,$,L,j,l]),k=e.useMemo(()=>({"--transform":t==="up"?"rotate(90deg)":t==="down"?"rotate(-90deg)":"none"}),[t]),D=e.useCallback(a=>[...Array(Number.isFinite(a)&&a>=0?a:0)].map((W,h)=>s.default.createElement(e.Fragment,{key:h},e.Children.map(M,v=>s.default.createElement("div",{style:k,className:"rfm-child"},v)))),[k,M]);return _?s.default.createElement("div",{ref:m,style:Q,className:"rfm-marquee-container "+w},X&&s.default.createElement("div",{style:V,className:"rfm-overlay"}),s.default.createElement("div",{className:"rfm-marquee",style:A,onAnimationIteration:T,onAnimationEnd:H},s.default.createElement("div",{className:"rfm-initial-child-container",ref:x},e.Children.map(M,a=>s.default.createElement("div",{style:k,className:"rfm-child"},a))),D(R-1)),s.default.createElement("div",{className:"rfm-marquee",style:A},D(R))):null});return S.default=d,S}var te=ee();const P=F(te);function ae(y){const{children:e,className:g,wrapperClassName:s,onClick:d,autoPlay:r=!1}=y,n=i.useRef(null),[w,l]=i.useState(!1),[u,c]=i.useState(!1),o=i.useCallback(()=>{if(n.current){const{scrollWidth:t,clientWidth:f}=n.current;l(t>f)}},[]);return i.useLayoutEffect(()=>(o(),window.addEventListener("resize",o),()=>{window.removeEventListener("resize",o)}),[o]),p.jsx("div",{onClick:d,role:d?"button":void 0,className:E("h-min w-auto overflow-hidden",s),onMouseEnter:()=>c(!0),onMouseLeave:()=>c(!1),children:w?p.jsx(P,{play:u||r,className:"[&_.rfm-child]:mr-3 [&_.rfm-child]:leading-tight",children:e}):p.jsx("p",{ref:n,className:E("overflow-hidden leading-tight whitespace-nowrap",g),children:e})})}function ne(y){const{children:e,className:g,wrapperClassName:s,onClick:d,autoPlay:r=!1}=y,n=i.useRef(null),[w,l]=i.useState(!1),[u,c]=i.useState(!1),o=i.useCallback(()=>{if(n.current){const{scrollWidth:t,clientWidth:f}=n.current;l(t>f)}},[]);return i.useLayoutEffect(()=>{o()},[o,e]),p.jsxs("div",{onClick:d,role:d?"button":void 0,className:E("relative h-min w-auto overflow-hidden",s),onMouseEnter:()=>c(!0),onMouseLeave:()=>c(!1),children:[p.jsx("p",{ref:n,className:E("absolute top-0 w-full overflow-hidden leading-tight whitespace-nowrap",w&&"opacity-0",g),children:e}),p.jsx(P,{play:u||r,className:E("[&_.rfm-child]:mr-3 [&_.rfm-child]:leading-tight",!w&&"pointer-events-none opacity-0"),children:e})]})}const se=i.memo(ne);export{se as B,ae as S};
