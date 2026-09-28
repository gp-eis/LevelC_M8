/* Interface-only: retain source sequence and existing activity behavior. */
document.addEventListener('DOMContentLoaded',() => {
  const path=location.pathname;
  const file=path.split('/').pop();
  const newPhonicsTitle=document.querySelector('.new-title');
  if(newPhonicsTitle){
    const firstGrid=newPhonicsTitle.previousElementSibling;
    const secondGrid=newPhonicsTitle.nextElementSibling;
    if(firstGrid?.matches('nav')&&secondGrid?.matches('nav')){
      firstGrid.append(...secondGrid.children);
      secondGrid.remove();
    }
    newPhonicsTitle.remove();
  }
  if(path.includes('/lessons/')){
    const files=['week-1-page-01.html','week-1-page-02.html','week-1-page-04.html','week-1-page-06.html','week-1-page-08.html'];
    const index=files.indexOf(file),main=document.querySelector('main');
    if(index>=0&&main){
      const title=main.querySelector('h1');if(title)title.textContent='Week 1 — Animals!';
      const header=main.querySelector('header');if(header){header.querySelectorAll('p').forEach(p=>p.remove());const count=document.createElement('p');count.className='c-page-count';count.textContent=`Page ${index+1} of ${files.length}`;header.append(count);}
      const nav=document.createElement('nav');nav.className='c-pagination';nav.setAttribute('aria-label','Literacy pages');nav.innerHTML=files.map((f,i)=>`<a href="${f}#lesson-focus" aria-label="Page ${i+1}" ${i===index?'aria-current="page"':''}>${i+1}</a>`).join('');main.append(nav);
    }
  }
});
