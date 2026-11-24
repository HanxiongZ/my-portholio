// Loaded only in the isolated local copy, before React. No source-site edits.
(() => {
 if(window.parent===window){document.documentElement.dataset.deskMode='full';return;}
 if(new URLSearchParams(location.search).get('desk')==='case'){
  document.documentElement.dataset.deskMode='full';
  document.addEventListener('keydown',event=>{
   if(event.key!=='Escape'||event.repeat||event.defaultPrevented||document.querySelector('dialog[open],[role="dialog"][data-state="open"]'))return;
   event.preventDefault();
   parent.postMessage({type:'desk:case-close'},location.origin);
  });
  return;
 }
 const origin=location.origin;document.documentElement.dataset.deskMode='small';let pendingActivation=null;
 const send=type=>parent.postMessage({type,path:location.pathname+location.search+location.hash},origin);
 document.addEventListener('click',event=>{
  const link=event.target.closest('a[href]');
  if(link){const url=new URL(link.href,location.href);if(url.origin===origin&&(url.pathname==='/'||url.pathname.startsWith('/project/')))link.href='/portfolio'+url.pathname+url.search+url.hash;}
  const action=event.target.closest('a[href],button,[role="button"]');
  const external=link&&(new URL(link.href,location.href).origin!==origin||link.target==='_blank'||link.hasAttribute('download'));
  // Keep React route mounting, image decoding and scroll handlers out of the
  // camera flight. Replay the actual first UI action once the same frame fills
  // the viewport. External/new-tab links keep their native user activation.
  if(document.documentElement.dataset.deskMode!=='full'&&action&&!external){event.preventDefault();event.stopImmediatePropagation();pendingActivation=action;}
  send('portfolio:activate');
 },true);
 document.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&!event.repeat&&!event.defaultPrevented&&!document.querySelector('dialog[open],[role="dialog"][data-state="open"]'))send('portfolio:close');
 });
 function setMode(mode){
  document.documentElement.dataset.deskMode=mode;
  if(mode==='small')for(const video of document.querySelectorAll('video'))video.pause();
  window.dispatchEvent(new Event('desk:mode'));
  if(mode==='full'&&pendingActivation){const action=pendingActivation;pendingActivation=null;requestAnimationFrame(()=>{if(action.isConnected&&document.documentElement.dataset.deskMode==='full')action.click();});}
  if(mode==='small')pendingActivation=null;
 }
 window.addEventListener('message',event=>{if(event.source!==parent||event.origin!==origin)return;if(event.data?.type==='desk:mode'&&['small','flight','full'].includes(event.data.mode))setMode(event.data.mode);});
 for(const method of ['pushState','replaceState']){const original=history[method];history[method]=function(...args){const result=original.apply(this,args);queueMicrotask(()=>send('portfolio:route'));return result;};}
 addEventListener('popstate',()=>send('portfolio:route'));
 function appearance(){const surface=document.querySelector('#root > div > div');if(surface)parent.postMessage({type:'portfolio:appearance',background:getComputedStyle(surface).backgroundColor},origin);}
 addEventListener('DOMContentLoaded',()=>{
  let sent=false;
  const watch=new MutationObserver(check);
  function check(){
   if(sent||!document.querySelector('#root main h1,#root main section,#root main article'))return;
   sent=true;watch.disconnect();
   Promise.resolve(document.fonts?.ready).then(()=>requestAnimationFrame(()=>requestAnimationFrame(()=>{
    appearance();send('portfolio:ready');
    for(const surface of [document.querySelector('#root > div'),document.querySelector('#root > div > div')])if(surface){new MutationObserver(appearance).observe(surface,{attributes:true,attributeFilter:['class','style']});surface.addEventListener('transitionend',event=>{if(event.target===surface)appearance();});}
   })));
  }
  watch.observe(document.querySelector('#root')||document.body,{childList:true,subtree:true});check();
 },{once:true});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)for(const video of document.querySelectorAll('video'))video.pause();});
})();
