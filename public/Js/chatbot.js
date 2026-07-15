const KB = [
  { k:['thesis','مقالہ','research paper','dissertation'], a:'We compose full research theses/مقالہ — from outline and referencing to final formatting — matching your madrasah or university\'s exact requirements (Takhassus, MPhil, MA, and more).' },
  { k:['book','کتاب','author'], a:'We help write and compose books from start to finish: structuring chapters, editing language, and preparing print-ready files.' },
  { k:['article','composing'], a:'We compose polished articles on academic or religious topics, proofread for grammar and accuracy, and format them for publication.' },
  { k:['print','printing','panaflex','flex','banner'], a:'We handle professional printing and Panaflex/banner design for events, offices, and institutions — clean layouts, fast delivery.' },
  { k:['pdf','hard copy','scan'], a:'Send us your hard copies and we\'ll convert them into clean, properly formatted PDF files. We also convert PDF files into editable Word documents.' },
  { k:['word'], a:'Yes — we convert PDF documents into fully editable Word files, preserving your original formatting as closely as possible.' },
  { k:['cv','resume','biodata'], a:'We design professional CVs and resumes tailored to the job or program you\'re applying for, with clean, modern layouts.' },
  { k:['thumbnail','youtube'], a:'We design eye-catching YouTube thumbnails built to boost click-through rate, matching your channel\'s style.' },
  { k:['admission','apply','application','online'], a:'We assist with online admissions and applications of all kinds — forms, documents, and submission.' },
  { k:['exam','test','competition','seekam','سیکم'], a:'We help you register and prepare documentation for exams and competitions you want to take part in.' },
  { k:['price','cost','fee','قیمت','rate'], a:'Our pricing is kept extremely affordable and fair for students and institutions. Message us on WhatsApp with your requirement for an exact quote.' },
  { k:['time','deadline','how long','duration'], a:'We commit to timely, responsible delivery — turnaround depends on the scope of work, and we\'ll always agree a clear deadline with you upfront.' },
  { k:['contact','whatsapp','number','phone','call'], a:'You can reach us directly on WhatsApp at 0306-1819635 (or 0332-0033563), or use the Contact page form.' },
  { k:['location','address','where'], a:'We operate online and serve clients everywhere — all work and communication can be handled remotely via WhatsApp and email.' },
  { k:['owner','founder','hafiz','mahmood'], a:'Al-Hafiz Islamic Research Institute is led by Hafiz Mahmood, committed to trustworthy, standard-compliant academic work.' },
  { k:['review','feedback','rating'], a:'You can read real client reviews on our Reviews page — and after using our services, we\'d love for you to add your own!' },
  { k:['plagiarism','similarity','original'], a:'All written work goes through careful proofreading and similarity reduction to keep it authentic and plagiarism-free.' },
  { k:['hello','hi','salam','assalam'], a:'Wa Alaikum Assalam! Welcome to Al-Hafiz Islamic Research Institute. Ask me about our thesis writing, printing, CV design, or any other service.' },
];

function botReply(input){
  const q = input.toLowerCase();
  for(const item of KB){
    if(item.k.some(word=> q.includes(word))) return item.a;
  }
  return 'That\'s a great question — for a precise answer, please message our team directly on WhatsApp at 0306-1819635, or explore the Services page. I can also tell you about thesis writing, printing, CVs, PDF/Word conversion, thumbnails, admissions, or pricing.';
}

window.addEventListener('DOMContentLoaded', ()=>{
  const toggle = document.getElementById('chatToggle');
  const win = document.getElementById('chatWindow');
  const body = document.getElementById('chatBody');
  const form = document.getElementById('chatForm');
  const input = document.getElementById('chatInput');
  if(!toggle) return;

  toggle.addEventListener('click', ()=> win.classList.toggle('open'));
  document.querySelectorAll('.chip').forEach(chip=>{
    chip.addEventListener('click', ()=>{
      addMsg(chip.textContent, 'user');
      respond(chip.textContent);
    });
  });

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const val = input.value.trim();
    if(!val) return;
    addMsg(val, 'user');
    input.value = '';
    respond(val);
  });

  function addMsg(text, who){
    const div = document.createElement('div');
    div.className = 'msg ' + who;
    div.textContent = text;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
  }
  function respond(userText){
    setTimeout(()=> addMsg(botReply(userText), 'bot'), 450);
  }
});
