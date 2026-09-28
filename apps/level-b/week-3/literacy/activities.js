export function setupActivities(ctx){
  const {page,stage,layer,status,button,wrong,mark,say,controls,completed,resetters,isActive,finish}=ctx;
  function chooseMany(items,total){
    items.forEach(({label,x,y,w,h,correct})=>{
      const b=button('Choose '+label,x,y,w,h,'b-hotspot b-picture-choice');
      b.onclick=()=>{if(!isActive()||completed.has(label))return;if(!correct){wrong(b);return;}
        mark(b);b.disabled=true;completed.add(label);status.textContent=completed.size+' of '+total+' found.';
        if(completed.size===total)finish(label);else say(label);
      };
    });
  }
  if(page===22){
    chooseMany(['toaster','ham','honey','jam','bread','kettle'].map((label,i)=>({label,x:[17.5,39.8,62.3][i%3],y:i<3?29.4:54.9,w:20,h:24.5,correct:['toaster','honey','bread'].includes(label)})),3);
  }
  if(page===23){
    const names=['honey pancakes','whipped drink','salad','burger','headphones','pencil','hat','honey cake','sun','cat','honey tea','shoes','cola','honey chicken','piggy bank','flower'];
    chooseMany(names.map((label,i)=>({label,x:22.2+i%4*13.9,y:[31.7,46.9,62,77][Math.floor(i/4)],w:13.9,h:i<12?15.1:16.4,correct:[0,7,10,13].includes(i)})),4);
  }
  if(page===24){
    let selected=null;const sources=new Map(),targets=[];
    const select=(letter,b)=>{if(!isActive()||completed.has(letter))return;selected=letter;sources.forEach(source=>source.classList.remove('is-selected'));b.classList.add('is-selected');say(letter);status.textContent='Choose the word for '+letter+'.';};
    ['c','s','p','t'].forEach((letter,i)=>{
      const b=button('Letter '+letter,45,[39.8,52.8,65.5,79][i],9.6,12.2,'b-hotspot b-letter-source');sources.set(letter,b);b.draggable=true;
      b.onclick=()=>select(letter,b);
      b.addEventListener('dragstart',event=>{if(!isActive()||completed.has(letter)){event.preventDefault();return;}select(letter,b);event.dataTransfer.setData('text/plain',letter);});
    });
    [{letter:'p',word:'pancakes',tail:'ancakes',x:9.1,y:58.1,w:23.2},{letter:'s',word:'sweet tea',tail:'weet tea',x:9.1,y:85.9,w:23.2},{letter:'c',word:'cake',tail:'ake',x:67.8,y:58.1,w:23.2},{letter:'t',word:'toast',tail:'oast',x:67.8,y:85.9,w:23.2}].forEach(item=>{
      const b=button('Complete '+item.word,item.x,item.y,item.w,6,'b-hotspot b-word-target');
      const blank=document.createElement('span');blank.className='b-initial';blank.textContent='_';b.append(blank,document.createTextNode(item.tail));targets.push({b,blank});
      const place=letter=>{if(!isActive()||completed.has(item.letter))return;if(!letter){status.textContent='Choose a letter first.';say('Choose a letter first.');return;}if(letter!==item.letter){wrong(b);return;}
        blank.textContent=letter;mark(b);mark(sources.get(letter));sources.get(letter).disabled=true;b.disabled=true;completed.add(letter);selected=null;sources.forEach(source=>source.classList.remove('is-selected'));status.textContent=completed.size+' of 4 words completed.';
        if(completed.size===4)finish(item.word);else say(item.word);
      };
      b.onclick=()=>place(selected);b.addEventListener('dragover',e=>{if(isActive())e.preventDefault();});b.addEventListener('drop',e=>{e.preventDefault();const letter=e.dataTransfer.getData('text/plain');if(sources.has(letter))place(letter);});
    });
    resetters.push(()=>{selected=null;targets.forEach(({blank})=>blank.textContent='_');sources.forEach(b=>b.classList.remove('is-selected'));});
  }
  if(page===25){
    let count=0;const counted=new Set();
    const positions=[[42.5,35.5,11,21],[55.5,36,12,21],[71.5,34,10,22.5],[85,34,10.5,22.5],[40.5,58.5,10.5,21],[55,59,10,21],[67,59,10.5,21],[82,59,10,21]];
    positions.forEach(([x,y,w,h],i)=>{const b=button('Count drink '+(i+1),x,y,w,h,'b-hotspot b-count-drink');b.onclick=()=>{if(!isActive()||counted.has(i))return;counted.add(i);b.classList.add('is-counted');b.setAttribute('aria-pressed','true');b.textContent=counted.size;say(String(counted.size));status.textContent=counted.size+' drinks counted.';};});
    const picker=document.createElement('div');picker.className='b-drink-picker';
    const output=document.createElement('output');output.className='b-drink-answer';output.setAttribute('aria-label','Number of drinks');output.textContent='0';stage.insertBefore(output,layer);
    const up=document.createElement('button'),down=document.createElement('button'),go=document.createElement('button');
    [[up,'▲','Increase number'],[down,'▼','Decrease number'],[go,'Go','Check number']].forEach(([b,text,label])=>{b.type='button';b.textContent=text;b.setAttribute('aria-label',label);controls.push(b);});
    up.className='count-up';down.className='count-down';go.className='count-go';
    const update=delta=>{if(!isActive())return;count=Math.max(0,Math.min(10,count+delta));output.textContent=count;say(String(count));};
    up.onclick=()=>update(1);down.onclick=()=>update(-1);go.onclick=()=>{if(!isActive())return;if(count!==8){wrong(picker);return;}picker.classList.remove('is-wrong');output.classList.add('is-correct');status.textContent='There are 8 drinks.';finish('There are eight drinks.');};
    picker.append(up,down,go);stage.insertBefore(picker,layer);
    const mobile=matchMedia('(max-width:650px)');
    const placePicker=()=>{picker.classList.toggle('is-mobile',mobile.matches);if(mobile.matches)document.querySelector('.b-controls').prepend(picker);else stage.insertBefore(picker,layer);};
    mobile.addEventListener('change',placePicker);placePicker();
    resetters.push(()=>{count=0;output.textContent='0';output.classList.remove('is-correct');counted.clear();clearTimeout(picker.wrongTimer);picker.classList.remove('is-wrong');stage.querySelectorAll('.b-count-drink').forEach(b=>{b.textContent='';b.classList.remove('is-counted');});});
  }
}
