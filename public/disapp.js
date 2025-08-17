let allQuestions=[];

document.addEventListener('DOMContentLoaded', () => {
  const quesForm = document.getElementById("question-form");

quesForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const titleEl = document.getElementById("title");
  const descEl = document.getElementById("description");
  const errorDiv = document.getElementById("error-msg");

  const title = titleEl.value.trim();
  const description = descEl.value.trim();

  if (!title || !description) {
    errorDiv.textContent = "Please fill in both fields.";
    return;
  }

  try {
    const res = await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });

    if (!res.ok) {
      const { error } = await res.json();
      errorDiv.textContent = error || "Failed to save question.";
      return;
    }

    const savedQuestion = await res.json();
    appendQuestionToList(savedQuestion);

    quesForm.reset();
    errorDiv.textContent = ""; 
  } catch (err) {
    errorDiv.textContent = "⚠️ Error submitting question. Try again.";
    console.error("Error submitting question:", err);
  }
});


  const searchBox = document.getElementById('search');
  searchBox.addEventListener('change', (e) => {
    e.preventDefault();
    const term = searchBox.value.trim();
    if (!term) {
      displayQuestions(allQuestions);
    } else {
      const filtered = allQuestions.filter(q =>
        q.title.includes(term)
      );
      displayQuestions(filtered, term);
    }
    searchBox.value = "";
  });

  const newF = document.getElementById("new-btn");
  newF.addEventListener("click", showQF);

  loadAllQ();
});



async function loadAllQ() {
  const res =await fetch('/api/questions');
  const questions= await res.json(); 
  allQuestions=questions.filter(q=> !q.resolved);

  allQuestions.sort((a,b)=> new Date(b.updatedAt)-new Date(a.updatedAt))
  displayQuestions(allQuestions);
}


function displayQuestions(questions, term = "") {
 const list=document.getElementById('question-list');
 list.innerHTML= '';

 questions.forEach(q => {
const li =document.createElement('li');
let title= q.title;

 if(term.trim()){
    const regex= new RegExp(term, 'gi'); 
    const matched= title.match(regex);

  if(matched){
    matched.forEach(m=>{
        title = title.replace(m, `<span style="background-color:yellow">${m}</span>`);
    });
  }
  }
  li.innerHTML = title;
  li.onclick = () => {
  loadQ(q._id);
  document.getElementById('welcome-box').style.display= 'none';
  document.getElementById('response').style.display ='block';
 };
 list.appendChild(li);

 });
}

function appendQuestionToList(q) {
  const list = document.getElementById('question-list');
  const li = document.createElement('li');
  li.textContent = q.title;
  li.onclick=()=>{
    loadQ(q._id);
    document.getElementById('welcome-box').style.display = 'none';
    document.getElementById('response').style.display = 'block';
  };
  list.insertBefore(li,list.firstChild);
}

  
async function loadQ(id) {
 const res = await fetch(`/api/questions/${id}`);
const q = await res.json();

const clickedDiv = document.getElementById('clicked');
clickedDiv.innerHTML = ` 
  <h4>${q.title}</h4>
  <p>${q.description}</p>`;
 


const submittedDiv = document.getElementById("submitted");
submittedDiv.innerHTML = "";

q.responses.forEach((r) => {
  const resEle= createRespbox(r,id);
  submittedDiv.appendChild(resEle)
  reorder();
});

  const respForm=document.getElementById("response-form");
  respForm.onsubmit= async(e)=>{
    e.preventDefault();
    const name= respForm.name.value;
    const answer= respForm.answer.value;

      const res= await fetch(`/api/questions/${id}/response`,{
        method:'POST',
        headers:{'Content-Type': 'application/json'},
        body:JSON.stringify({name,answer})
      });
       respForm.reset();

      const updated= await res.json();
      allQuestions=allQuestions.filter(q=>q._id !== id);
      allQuestions.push(updated)
      allQuestions.sort((a,b)=> new Date(b.updatedAt)-new Date(a.updatedAt) )
     displayQuestions(allQuestions)

      await loadQ(id);        
  }

document.getElementById('resolve').onclick = async () => {
  const res = await fetch(`/api/questions/${id}/resolve`, {
    method:'POST',
    headers:{'Content-Type':'application/json'}
  });
  if(res.ok){ allQuestions=allQuestions.filter(q=>q._id !==id);
   displayQuestions(allQuestions);
    showQF();}
    else{ console.log("error resolving")}
 } }

function showQF(){
  document.getElementById('welcome-box').style.display = 'block';
  document.getElementById('response').style.display = 'none';
}



function createRespbox(r,id){
  const resBox=document.createElement('div');
 const p = document.createElement('p');
  p.textContent = `${r.name}: ${r.answer}`;

  const reactionDiv = document.createElement('div');
  const likeBtn = document.createElement('button');
  likeBtn.textContent = "👍";

 // let count1=0;
  const lc=document.createElement('span');
  lc.textContent=r.like||0;

  likeBtn.addEventListener("click", async ()=>{
    const res= await fetch(`/api/questions/${id}/response/${r._id}/like`,{
      method: 'POST'
    })
    const data = await res.json();
    lc.textContent=data.like;
    // count1++;
    // lc.textContent=count1;
    reorder();
  })
   
  const dislikeBtn = document.createElement('button');
  dislikeBtn.textContent = "👎";
  const dc=document.createElement('span');
   dc.textContent=r.like||0;
  dislikeBtn.addEventListener("click", async ()=>{
    const res= await fetch(`/api/questions/${id}/response/${r._id}/dislike`,{
      method: 'POST'
    })
    const data = await res.json();
    dc.textContent=data.dislike;
  });
  reactionDiv.appendChild(likeBtn);
  reactionDiv.appendChild(lc);
  reactionDiv.appendChild(dislikeBtn);
  reactionDiv.appendChild(dc);
  resBox.appendChild(p);
  resBox.appendChild(reactionDiv);

  return resBox;
}

function reorder(){
const container =document.getElementById('submitted')
const arr= Array.from(container.children)

for(let i=1; i<arr.length;i++){
  const curr= arr[i];
  console.log(curr)
  const count1= curr.querySelector('span').innerText;
  const currLike= parseInt(count1,10);

    for(let j=0; j<arr.length;j++){
  const target= arr[j];
  const count2= target.querySelector('span').innerText;
  const targetLike= parseInt(count2,10);

 if(currLike> targetLike){
  container.insertBefore(curr,target);
   const [move]=arr.splice(i,1)
   arr.splice(j,0,move[0]);
   break;
 }
}
}}

