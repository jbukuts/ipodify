import{L as Y,N as F,r as c,j as p,g as E}from"./index-CySbD327.js";var S={},P;function ee(){if(P)return S;P=1;function y(r){if(typeof window>"u")return;const n=document.createElement("style");return n.setAttribute("type","text/css"),n.innerHTML=r,document.head.appendChild(n),r}Object.defineProperty(S,"__esModule",{value:!0});var e=Y();function g(r){return r&&typeof r=="object"&&"default"in r?r:{default:r}}var o=g(e);y(`.rfm-marquee-container {
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
}`);const d=e.forwardRef(function({style:n={},className:w="",autoFill:i=!1,play:u=!0,pauseOnHover:f=!1,pauseOnClick:s=!1,direction:t="left",speed:l=50,delay:W=0,loop:j=0,gradient:X=!1,gradientColor:z="white",gradientWidth:q=200,onFinish:H,onCycleComplete:T,onMount:O,children:M},Z){const[C,G]=e.useState(0),[N,J]=e.useState(0),[R,$]=e.useState(1),[_,K]=e.useState(!1),Q=e.useRef(null),m=Z||Q,x=e.useRef(null),b=e.useCallback(()=>{if(x.current&&m.current){const a=m.current.getBoundingClientRect(),L=x.current.getBoundingClientRect();let h=a.width,v=L.width;(t==="up"||t==="down")&&(h=a.height,v=L.height),$(i&&h&&v&&v<h?Math.ceil(h/v):1),G(h),J(v)}},[i,m,t]);e.useEffect(()=>{if(_&&(b(),x.current&&m.current)){const a=new ResizeObserver(()=>b());return a.observe(m.current),a.observe(x.current),()=>{a&&a.disconnect()}}},[b,m,_]),e.useEffect(()=>{b()},[b,M]),e.useEffect(()=>{K(!0)},[]),e.useEffect(()=>{typeof O=="function"&&O()},[]);const A=e.useMemo(()=>i?N*R/l:N<C?C/l:N/l,[i,C,N,R,l]),U=e.useMemo(()=>Object.assign(Object.assign({},n),{"--pause-on-hover":!u||f?"paused":"running","--pause-on-click":!u||f&&!s||s?"paused":"running","--width":t==="up"||t==="down"?"100vh":"100%","--transform":t==="up"?"rotate(-90deg)":t==="down"?"rotate(90deg)":"none"}),[n,u,f,s,t]),V=e.useMemo(()=>({"--gradient-color":z,"--gradient-width":typeof q=="number"?`${q}px`:q}),[z,q]),B=e.useMemo(()=>({"--play":u?"running":"paused","--direction":t==="left"?"normal":"reverse","--duration":`${A}s`,"--delay":`${W}s`,"--iteration-count":j?`${j}`:"infinite","--min-width":i?"auto":"100%"}),[u,t,A,W,j,i]),k=e.useMemo(()=>({"--transform":t==="up"?"rotate(90deg)":t==="down"?"rotate(-90deg)":"none"}),[t]),D=e.useCallback(a=>[...Array(Number.isFinite(a)&&a>=0?a:0)].map((L,h)=>o.default.createElement(e.Fragment,{key:h},e.Children.map(M,v=>o.default.createElement("div",{style:k,className:"rfm-child"},v)))),[k,M]);return _?o.default.createElement("div",{ref:m,style:U,className:"rfm-marquee-container "+w},X&&o.default.createElement("div",{style:V,className:"rfm-overlay"}),o.default.createElement("div",{className:"rfm-marquee",style:B,onAnimationIteration:T,onAnimationEnd:H},o.default.createElement("div",{className:"rfm-initial-child-container",ref:x},e.Children.map(M,a=>o.default.createElement("div",{style:k,className:"rfm-child"},a))),D(R-1)),o.default.createElement("div",{className:"rfm-marquee",style:B},D(R))):null});return S.default=d,S}var te=ee();const I=F(te);function re(y){const{children:e,className:g,wrapperClassName:o,onClick:d,autoPlay:r=!1}=y,n=c.useRef(null),[w,i]=c.useState(!1),[u,f]=c.useState(!1),s=c.useCallback(()=>{if(n.current){const{scrollWidth:t,clientWidth:l}=n.current;i(t>l)}},[]);return c.useLayoutEffect(()=>(s(),window.addEventListener("resize",s),()=>{window.removeEventListener("resize",s)}),[s]),p.jsx("div",{onClick:d,role:d?"button":void 0,className:E("h-min w-auto overflow-hidden",o),onMouseEnter:()=>f(!0),onMouseLeave:()=>f(!1),children:w?p.jsx(I,{play:u||r,className:"[&_.rfm-child]:mr-3 [&_.rfm-child]:leading-tight",children:e}):p.jsx("p",{ref:n,className:E("overflow-hidden leading-tight whitespace-nowrap",g),children:e})})}function ae(y){const{children:e,className:g,wrapperClassName:o,onClick:d,autoPlay:r=!1}=y,n=c.useRef(null),[w,i]=c.useState(!1),[u,f]=c.useState(!1),s=c.useCallback(()=>{if(n.current){const{scrollWidth:t,clientWidth:l}=n.current;console.log(t>l,t,l),i(t>l)}},[]);return c.useLayoutEffect(()=>{console.log("checking on layout effect"),s()},[s,e]),p.jsxs("div",{onClick:d,role:d?"button":void 0,className:E("relative h-min w-auto overflow-hidden",o),onMouseEnter:()=>f(!0),onMouseLeave:()=>f(!1),children:[p.jsx("p",{ref:n,className:E("absolute top-0 w-full overflow-hidden leading-tight whitespace-nowrap",w&&"opacity-0",g),children:e}),p.jsx(I,{play:u||r,className:E("[&_.rfm-child]:mr-3 [&_.rfm-child]:leading-tight",!w&&"pointer-events-none opacity-0"),children:e})]})}export{ae as B,re as S};
