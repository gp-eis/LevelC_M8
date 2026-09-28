import { revealNextAction, hideNextAction } from "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/assets/navigation/gp-navigation.js?v=20260902-8";

const page = Number(document.body.dataset.page);
const configs = {
  2:{title:"Count the bees",prompt:"How many bees are in the garden?",choices:[["5 bees",0],["6 bees",1],["7 bees",0],["8 bees",0]],success:"Yes! There are 6 bees in the garden."},
  3:{title:"Complete the park words",prompt:"Which first letters complete bench, trees, lamp, and people?",choices:[["b · t · l · p",1],["p · l · t · b",0],["d · f · r · m",0],["t · b · p · l",0]],success:"Great spelling: bench, trees, lamp, and people."},
  4:{title:"What is at the park?",prompt:"Choose all five things shown for the park.",multi:true,correct:["grass","lamp","flowers","bench","trees"],choices:["grass","lamp","flowers","bench","trees","classroom"],success:"You found the five park words."},
  5:{title:"Follow the park maze",prompt:"Where is she trying to go? Trace the path in your physical book.",choices:[["The park gate",1],["The classroom",0],["The pond",0],["The store",0]],success:"Yes—the path leads to the park gate. Finish tracing it in the book."},
  6:{title:"Read the bench clue",prompt:"Complete the sentence: There are bees near the ___.",choices:[["bench",1],["fountain",0],["classroom",0],["pond",0]],success:"Correct! There are bees near the bench."},
  7:{title:"Write with the bench and lamp",prompt:"Use the picture and word bank to complete the sentences on physical page 7.",confirm:true,success:"Page 7 stays in the physical book. Continue after the writing is complete."},
  8:{title:"Read the tree clue",prompt:"Which sentence matches the picture?",choices:[["There are bees near the people.",0],["There are bees near the trees.",1],["There are bees in a classroom.",0],["There are bees under the pond.",0]],success:"Correct! There are bees near the trees."},
  9:{title:"Write with trees and grass",prompt:"Use the picture and word bank to complete the sentences on physical page 9.",confirm:true,success:"Page 9 stays in the physical book. You finished the Week 1 physical-page sequence."}
};
const config=configs[page];
// Active website sequence: opening video, then physical pages 2–5.
// Physical pages 6 and 8 are comprehension; 7 and 9 are handwriting/writing.
// Their source files remain stored, but the scope rule intentionally leaves them unlinked.
const nextIncludedPage={2:3,3:4,4:5};
const stage=document.querySelector("#page-stage");const feedback=document.querySelector("#feedback");const next=document.querySelector("#next-action");
document.querySelector("#page-title").textContent=config.title;document.querySelector("#page-prompt").textContent=config.prompt;
function complete(){feedback.textContent=`⭐ ${config.success}`;feedback.className="feedback good";revealNextAction(next)}
function retry(button){button.classList.add("is-wrong");button.disabled=true;feedback.textContent="Good try. Look at the physical book page and choose again.";feedback.className="feedback try"}
if(config.confirm){stage.innerHTML='<button class="page-confirm" type="button">I finished this book page</button>';stage.querySelector("button").addEventListener("click",complete)}
else if(config.multi){const chosen=new Set();stage.innerHTML=`<div class="choice-grid">${config.choices.map(x=>`<button class="choice" data-value="${x}">${x}</button>`).join("")}</div><button class="page-confirm" type="button">Check my choices</button>`;stage.querySelectorAll("[data-value]").forEach(b=>b.addEventListener("click",()=>{b.classList.toggle("is-selected");b.classList.contains("is-selected")?chosen.add(b.dataset.value):chosen.delete(b.dataset.value)}));stage.querySelector(".page-confirm").addEventListener("click",()=>chosen.size===config.correct.length&&config.correct.every(x=>chosen.has(x))?complete():(feedback.textContent="Look again. Choose the five park items, without the classroom.",feedback.className="feedback try"))}
else{stage.innerHTML=`<div class="choice-grid">${config.choices.map(([label,ok])=>`<button class="choice" data-correct="${ok}">${label}</button>`).join("")}</div>`;stage.querySelectorAll(".choice").forEach(b=>b.addEventListener("click",()=>{if(b.dataset.correct==="1"){b.classList.add("is-correct");stage.querySelectorAll(".choice").forEach(x=>x.disabled=true);complete()}else retry(b)}))}
next.addEventListener("click",()=>{const following=nextIncludedPage[page];location.href=(following?"page-"+String(following).padStart(2,"0")+".html":"../")+"#lesson-focus"});hideNextAction(next);
