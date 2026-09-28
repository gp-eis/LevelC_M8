export function setupActivities(ctx){
  const {page,stage,layer,status,button,wrong,mark,say,controls,completed,resetters,isActive,finish}=ctx;
  const ns='http://www.w3.org/2000/svg';
  function canvas(){const svg=document.createElementNS(ns,'svg');svg.classList.add('b-trace');svg.setAttribute('viewBox','0 0 100 100');svg.setAttribute('preserveAspectRatio','none');svg.setAttribute('aria-hidden','true');stage.insertBefore(svg,layer);return svg;}
  function line(svg,a,b,preview=false){const l=document.createElementNS(ns,'line');l.classList.add(preview?'b-match-preview':'b-match-line');l.setAttribute('x1',a.x);l.setAttribute('y1',a.y);l.setAttribute('x2',b.x);l.setAttribute('y2',b.y);svg.append(l);return l;}
  function follow(preview){stage.addEventListener('pointermove',e=>{if(preview.style.display==='none'||!isActive())return;const r=stage.getBoundingClientRect();preview.setAttribute('x2',(e.clientX-r.left-stage.clientLeft)/stage.clientWidth*100);preview.setAttribute('y2',(e.clientY-r.top-stage.clientTop)/stage.clientHeight*100);});}
  function aim(preview,point){for(const axis of ['x','y']){preview.setAttribute(axis+'1',point[axis]);preview.setAttribute(axis+'2',point[axis]);}preview.style.display='';}
  if(page===32){
    const answer=document.createElement('output');answer.className='b-sweet-answer';stage.insertBefore(answer,layer);
    [['butter',55.2,52.7,15.8,10.3],['knife',74.5,52.7,15.2,10.3],['sweet',59,65.8,15.2,10.2],['bread',78.5,65.8,14.8,10.2],['toast',68.8,78.3,15,10.2]].forEach(([word,x,y,w,h])=>{const b=button('Choose '+word,x,y,w,h,'b-hotspot b-word-choice');b.onclick=()=>{if(!isActive())return;if(word!=='sweet'){wrong(b);return;}mark(b);answer.textContent='sweet';status.textContent='I like honey. It is sweet.';finish('I like honey. It is sweet.');};});
    resetters.push(()=>answer.textContent='');
  }
  if(page===33){
    const svg=canvas(),route=document.createElementNS(ns,'g');svg.append(route);
    const start={x:8,y:70.4},end={x:92,y:70.4};
    const labels=['throat','skin','body','tummy'],xs=[18.8,39.7,60.1,81];
    const decoys=['coffee','jam','honey jar','candy'];
    let step=0,last=start,ready=false,generation=0;
    const choices=[],shades=[];
    function paint(){
      shades.forEach((shade,i)=>{shade.classList.toggle('is-current',i===step);shade.classList.toggle('is-future',i>step);shade.classList.toggle('is-done',i<step);});
      choices.forEach(({b,column})=>{b.disabled=!ready||column!==step||!isActive();b.classList.toggle('is-inactive-column',column!==step);});
    }
    function ask(){
      ready=false;paint();const token=generation;
      status.textContent='Choose '+labels[step]+'.';
      say('Choose '+labels[step]+'.',()=>{if(token!==generation||!isActive())return;ready=true;paint();},true);
    }
    labels.forEach((label,column)=>{
      const shade=document.createElement('div');shade.className='b-column-focus';shade.style.left=(xs[column]-9.8)+'%';shade.setAttribute('aria-hidden','true');stage.insertBefore(shade,layer);shades.push(shade);
      const correctY=column===1?82.4:57.9;
      [[label,correctY,true],[decoys[column],column===1?57.9:82.4,false]].forEach(([name,y,correct])=>{
        const b=button('Choose '+name,xs[column]-8,y-10,16,20,'b-hotspot b-picture-choice');choices.push({b,column});
        b.onclick=()=>{
          if(!ready||!isActive()||column!==step)return;
          if(!correct){wrong(b);return;}
          ready=false;mark(b);const point={x:xs[column],y};line(route,last,point);last=point;step++;paint();
          if(step===4){line(route,last,end);status.textContent='All four columns complete.';finish('Throat, skin, body, tummy.');}
          else ask();
        };
      });
    });
    ctx.starters.push(ask);
    resetters.push(()=>{generation++;step=0;last=start;ready=false;route.replaceChildren();paint();});
    window.addEventListener('pagehide',()=>{generation++;ready=false;});
  }
  if(page===34){
    const group=document.createElement('div');group.className='b-basket-pickers';document.querySelector('.b-controls').prepend(group);
    [{id:'left',label:'Left basket',answer:5,x:38.9},{id:'right',label:'Right basket',answer:4,x:85.9}].forEach(item=>{
      let value=0;const output=document.createElement('output');output.className='b-total-answer';output.style.left=item.x+'%';output.textContent='0';output.setAttribute('aria-label',item.label+' total');stage.insertBefore(output,layer);
      const picker=document.createElement('div');picker.className='b-basket-picker';const label=document.createElement('strong');label.textContent=item.label;picker.append(label);group.append(picker);
      const inputs=[];const update=delta=>{if(!isActive()||completed.has(item.id))return;value=Math.max(0,Math.min(10,value+delta));output.textContent=value;say(String(value));};
      for(const [text,action] of [['▲',()=>update(1)],['▼',()=>update(-1)],['Go',()=>{if(!isActive()||completed.has(item.id))return;if(value!==item.answer){wrong(picker);return;}completed.add(item.id);output.classList.add('is-correct');inputs.forEach(b=>b.disabled=true);status.textContent=completed.size+' of 2 totals correct.';if(completed.size===2)finish('Both totals are correct. Five dollars and four dollars.');else say(item.answer+' dollars.');}]]){const b=document.createElement('button');b.type='button';b.textContent=text;b.setAttribute('aria-label',item.label+' '+(text==='▲'?'increase total':text==='▼'?'decrease total':'check total'));b.onclick=action;picker.append(b);controls.push(b);inputs.push(b);}
      resetters.push(()=>{value=0;output.textContent='0';output.classList.remove('is-correct');clearTimeout(picker.wrongTimer);picker.classList.remove('is-wrong');});
    });
  }
  if(page===35){
    const svg=canvas(),lines=document.createElementNS(ns,'g');svg.append(lines);const preview=line(svg,{x:0,y:0},{x:0,y:0},true);preview.style.display='none';follow(preview);let selected=null;
    const clear=()=>{selected?.b.classList.remove('is-linking');selected=null;preview.style.display='none';};
    const foods=['honey toast','honey candy','honey spread','honey tea'];
    [foods,['honey candy','honey tea','honey toast','honey spread']].forEach((row,side)=>row.forEach((food,i)=>{
      const p={x:[14.56,38.16,61.7,85.44][i],y:side===0?48:67.2,food,side};const b=button((side===0?'Food dot: ':'Person dot: ')+food,p.x,p.y,5,6.36,'b-hotspot b-match-dot');p.b=b;
      b.onclick=()=>{if(!isActive()||completed.has(food))return;if(selected===p){clear();return;}if(!selected||selected.side===side){clear();selected=p;b.classList.add('is-linking');aim(preview,p);say(food);return;}if(selected.food!==food){wrong(b);return;}line(lines,selected,p);mark(b);mark(selected.b);b.disabled=true;selected.b.disabled=true;completed.add(food);clear();status.textContent=completed.size+' of 4 matched.';if(completed.size===4)finish(food);else say(food);};
    }));
    stage.addEventListener('keydown',e=>{if(e.key==='Escape')clear();});resetters.push(()=>{clear();lines.replaceChildren();});
  }
}
