/* ====== QUIZ DATA (40 Questions) ====== */
const quizData = [
{question:"What does JS stand for?",answers:["Java Style","JavaScript","Just Script","JScript"],correct:1},
{question:"Inside which HTML tag do we put JavaScript?",answers:["<script>","<js>","<javascript>","<code>"],correct:0},
{question:"Which company originally developed JavaScript?",answers:["Google","Oracle","Netscape","Microsoft"],correct:2},
{question:"How do you write a single-line comment in JavaScript?",answers:["/* comment */","// comment","# comment","-- comment"],correct:1},
{question:"Which keyword declares a variable in older JavaScript?",answers:["make x","var x","new x","create x"],correct:1},
{question:"Which keyword declares a block-scoped variable?",answers:["var","static","let","define"],correct:2},
{question:"What does DOM stand for?",answers:["Document Object Model","Data Object Module","Digital Order Model","Desktop Object Manager"],correct:0},
{question:"How do you create an array?",answers:["()","{}","[]","<>"],correct:2},
{question:"Which method adds an item to the end of an array?",answers:["push()","add()","insert()","append()"],correct:0},
{question:"How do you convert JSON text to a JavaScript object?",answers:["JSON.object()","JSON.convert()","JSON.parse()","JSON.toObj()"],correct:2},
{question:"Which operator checks both value and type?",answers:["==","=","===","!="],correct:2},
{question:"Which of the following is a loop statement in JavaScript?",answers:["run","move","loop","for"],correct:3},
{question:"What does NaN represent?",answers:["Not a Number","New Added Number","Negative Array Node","Number And Name"],correct:0},
{question:"Which symbol starts a template literal?",answers:["'","`","~","@"],correct:1},
{question:"Which event fires when a user clicks an element?",answers:["hover","press","click","touch"],correct:2},
{question:"Which function shows a popup alert?",answers:["alert()","pop()","box()","message()"],correct:0},
{question:"Which is NOT a JavaScript primitive type?",answers:["string","array","boolean","number"],correct:1},
{question:"How do you define a function?",answers:["func my()","function my()","define my()","make function"],correct:1},
{question:"Which method removes the last element from an array?",answers:["remove()","delete()","pop()","shift()"],correct:2},
{question:"What is the typeof [] in JavaScript?",answers:["array","object","list","collection"],correct:1},
{question:"What is a Promise in JavaScript?",answers:["Thread","Object for async","Loop","Error"],correct:1},
{question:"Which function executes code after a delay?",answers:["setWait()","wait()","setTimeout()","delay()"],correct:2},
{question:"How do you stop a loop immediately?",answers:["quit","stop","break","end"],correct:2},
{question:"Which symbol is the OR operator?",answers:["&&","||","!!","%%"],correct:1},
{question:"What is localStorage used for?",answers:["Database","Temporary RAM","Browser storage","Cookies"],correct:2},
{question:"Which value represents 'no value' and intentional absence?",answers:["0","false","undefined","null"],correct:3},
{question:"How do you create an object literal?",answers:["()","{}","[]","<>"],correct:1},
{question:"Which array method iterates through items?",answers:["run()","forEach()","repeat()","loop()"],correct:1},
{question:"Which keyword is used to catch exceptions?",answers:["catch","rescue","check","fix"],correct:0},
{question:"Which method converts a value to a string?",answers:["toString()","string()","convert()","toStr()"],correct:0},
{question:"Which symbol is the AND operator?",answers:["||","&&","%%","//"],correct:1},
{question:"What does event.preventDefault() do?",answers:["Stop JS","Stop browser default action","Stop server","Stop CSS"],correct:1},
{question:"Which function runs repeated code at intervals?",answers:["repeat()","interval()","setInterval()","loopEvery()"],correct:2},
{question:"How do you get the length of an array?",answers:[".size",".length",".count",".num"],correct:1},
{question:"Which keyword declares a constant?",answers:["fix","const","perma","let"],correct:1},
{question:"Which operator concatenates strings (commonly)?",answers:["-","+","*","%"],correct:1},
{question:"Which are valid boolean values in JS?",answers:["on/off","true/false","1/2","yes/no"],correct:1},
{question:"Which method converts an object to JSON text?",answers:["JSON.text()","JSON.stringify()","JSON.objectify()","JSON.convert()"],correct:1},
{question:"Where does JavaScript primarily run?",answers:["Browser","OS","BIOS","Router"],correct:0},
{question:"Which statement imports modules in modern JS?",answers:["get","import","include","use"],correct:1}
];

/* ====== SETTINGS ====== */
const QUESTION_TIME=60;
let currentIndex=0,timeLeft=QUESTION_TIME,timerInterval=null;
let userAnswers=new Array(quizData.length).fill(null);

/* ====== DOM ====== */
const questionText=document.getElementById('questionText');
const answersWrap=document.getElementById('answers');
const timerText=document.getElementById('timerText');
const timerProgress=document.getElementById('timerProgress');
const circleProgress=document.getElementById('circleProgress');
const prevBtn=document.getElementById('prevBtn');
const nextBtn=document.getElementById('nextBtn');
const submitBtn=document.getElementById('submitBtn');
const qCount=document.getElementById('qCount');
const progressCircles=document.getElementById('progressCircles');
const resultModal=document.getElementById('resultModal');
const retryBtn=document.getElementById('retryBtn');
const closeBtn=document.getElementById('closeBtn');
const scoreBar=document.getElementById('scoreBar');
const scoreSummary=document.getElementById('scoreSummary');
const detailedResults=document.getElementById('detailedResults');
const greetingEl=document.getElementById('greeting');

/* ====== AUDIO ====== */
const AudioCtx = window.AudioContext||window.webkitAudioContext;
let audioCtx=null;
function ensureAudioContext(){ if(!audioCtx) audioCtx=new AudioCtx(); }
function playTone(freq=440,duration=120,type='sine',gain=0.06){try{ensureAudioContext();const o=audioCtx.createOscillator();const g=audioCtx.createGain();o.type=type;o.frequency.value=freq;g.gain.value=gain;o.connect(g);g.connect(audioCtx.destination);o.start();setTimeout(()=>o.stop(),duration);}catch(e){}}
function playCorrect(){ playTone(880,120,'sine',0.08); setTimeout(()=>playTone(1320,80,'sine',0.06),80);}
function playWrong(){ playTone(220,220,'square',0.08);}
function playTimeUp(){ playTone(260,300,'sawtooth',0.07); setTimeout(()=>playTone(180,200,'sine',0.06),120); }

/* ====== FUNCTIONS ====== */
function renderProgressCircles(){progressCircles.innerHTML='';quizData.forEach((q,i)=>{const btn=document.createElement('button');btn.className='prog'+(i===currentIndex?' active':'')+(userAnswers[i]!==null?' answered':'');btn.innerText=i+1;btn.onclick=()=>goToQuestion(i);progressCircles.appendChild(btn);}); const active=progressCircles.querySelector('.active'); if(active) active.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});}
function loadQuestion(idx=currentIndex){if(idx<0)idx=0;if(idx>=quizData.length)idx=quizData.length-1;currentIndex=idx;const q=quizData[currentIndex];questionText.textContent=q.question;answersWrap.innerHTML='';q.answers.forEach((ans,i)=>{const b=document.createElement('button');b.className='answer-btn';b.innerText=ans;b.onclick=()=>selectAnswer(i);if(userAnswers[currentIndex]===i)b.classList.add('selected');answersWrap.appendChild(b);});qCount.textContent=`${currentIndex+1} / ${quizData.length}`;renderProgressCircles();prevBtn.disabled=currentIndex===0;nextBtn.disabled=currentIndex===quizData.length-1;resetTimer();startTimer();}
function resetTimer(){clearInterval(timerInterval);timeLeft=QUESTION_TIME;updateTimerUI();}
function updateTimerUI(){timerText.textContent=`${timeLeft}s`;const fraction=timeLeft/QUESTION_TIME;timerProgress.style.width=`${fraction*100}%`;const offset=(1-fraction)*100;circleProgress.setAttribute('stroke-dasharray','100,100');circleProgress.style.strokeDashoffset=offset;if(fraction<=0.15)circleProgress.style.stroke='#ff4f4f'; else circleProgress.style.stroke='#39ffaf';}
function startTimer(){updateTimerUI();clearInterval(timerInterval);timerInterval=setInterval(()=>{timeLeft--; if(timeLeft<=0){clearInterval(timerInterval);autoAdvanceOnTimeout();return;}updateTimerUI();},1000);}
function autoAdvanceOnTimeout(){playTimeUp();if(currentIndex<quizData.length-1)goToQuestion(currentIndex+1);else showResults();}
function selectAnswer(choiceIndex){userAnswers[currentIndex]=choiceIndex;document.querySelectorAll('.answer-btn').forEach(btn=>btn.classList.remove('selected'));const buttons=Array.from(document.querySelectorAll('.answer-btn'));if(buttons[choiceIndex])buttons[choiceIndex].classList.add('selected');renderProgressCircles();playTone(660,80,'sine',0.03);}
function goToQuestion(i){loadQuestion(i);}
prevBtn.addEventListener('click',()=>{if(currentIndex>0)goToQuestion(currentIndex-1);});
nextBtn.addEventListener('click',()=>{if(currentIndex<quizData.length-1)goToQuestion(currentIndex+1);});
submitBtn.addEventListener('click',showResults);

function showResults(){
  clearInterval(timerInterval);
  const score=userAnswers.filter((ans,i)=>ans===quizData[i].correct).length;
  const percent=Math.round((score/quizData.length)*100);
  scoreSummary.textContent=`Congratulations, ${greetingEl.textContent.replace('Hello, ','').replace('! Good luck on your quiz!','')}! You scored ${score} / ${quizData.length} (${percent}%)`;
  scoreBar.style.width='0%';
  setTimeout(()=>scoreBar.style.width=percent+'%',100);
  detailedResults.innerHTML='';
  quizData.forEach((q,i)=>{
    const row=document.createElement('div');
    const left=document.createElement('div'); left.innerHTML=`<strong>Q${i+1}:</strong> ${q.question}`;
    const right=document.createElement('div'); 
    const userAns=userAnswers[i]===null?'No answer':q.answers[userAnswers[i]];
    const correctAns=q.answers[q.correct];
    if(userAnswers[i]===q.correct){right.innerHTML=`✔ ${userAns}`;right.classList.add('correct');} 
    else {right.innerHTML=`✖ ${userAns} (Correct: ${correctAns})`;right.classList.add('wrong');}
    row.appendChild(left); row.appendChild(right);
    detailedResults.appendChild(row);
  });
  resultModal.classList.remove('hidden');
  if(percent>=70) playCorrect(); else playWrong();
}

retryBtn.addEventListener('click',()=>{
  userAnswers=new Array(quizData.length).fill(null);
  currentIndex=0;
  resultModal.classList.add('hidden');
  loadQuestion(0);
});
closeBtn.addEventListener('click',()=>{resultModal.classList.add('hidden');});
resultModal.addEventListener('click',(e)=>{if(e.target===resultModal)resultModal.classList.add('hidden');});

document.addEventListener('keydown',(e)=>{
  if(e.key==='ArrowRight') nextBtn.click();
  if(e.key==='ArrowLeft') prevBtn.click();
  if(e.key==='Enter'){ if(resultModal.classList.contains('hidden')) nextBtn.click(); }
});

/* ====== INIT QUIZ AFTER NAME INPUT ====== */
const startBtnEl=document.getElementById('startBtn');
const usernameInput=document.getElementById('username');
const nameContainer=document.getElementById('nameContainer');
const quizContainer=document.getElementById('quizContainer');

startBtnEl.addEventListener('click',()=>{
  const name=usernameInput.value.trim();
  if(name===''){alert('Please enter your name'); return;}
  nameContainer.style.display='none';
  quizContainer.style.display='flex';
  greetingEl.textContent=`Hello, ${name}! Good luck on your quiz!`;
  loadQuestion(0);
});
usernameInput.addEventListener('keypress',(e)=>{if(e.key==='Enter') startBtnEl.click();});
