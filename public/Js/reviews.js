const SEED_REVIEWS = [
  {name:'Muhammad Usman', role:'MPhil Scholar', rating:5, text:'They composed my thesis chapters with real attention to referencing standards. Delivered on time, every time.'},
  {name:'Ayesha Siddiqui', role:'Madrasah Student', rating:5, text:'Got my hard-copy notes turned into a clean, searchable PDF within a day. Very professional team.'},
  {name:'Bilal Ahmed', role:'Job Applicant', rating:4, text:'My CV finally looks the part. Clear layout, good advice on content, fair price.'},
  {name:'Hafsa Tariq', role:'Content Creator', rating:5, text:'Their YouTube thumbnail designs boosted my click-through rate noticeably. Fast turnaround too.'}
];

/* -------- local fallback helpers (per-browser only) -------- */
function getLocalReviews(){
  const stored = JSON.parse(localStorage.getItem('ahri_reviews') || 'null');
  if(stored) return stored;
  localStorage.setItem('ahri_reviews', JSON.stringify(SEED_REVIEWS));
  return SEED_REVIEWS;
}
function saveLocalReview(review){
  const list = getLocalReviews();
  list.push(review);
  localStorage.setItem('ahri_reviews', JSON.stringify(list));
}

function stars(n){ return '★'.repeat(n) + '☆'.repeat(5-n); }
function escapeHtml(str){
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}
function renderList(reviews){
  const wrap = document.getElementById('reviewsList');
  if(!wrap) return;
  wrap.innerHTML = reviews.map(r=>`
    <div class="card review-card reveal in">
      <div class="review-stars">${stars(r.rating)}</div>
      <p>"${escapeHtml(r.text)}"</p>
      <div class="review-name">${escapeHtml(r.name)}</div>
      <div class="review-role">${escapeHtml(r.role || 'Client')}</div>
    </div>
  `).join('');
}

/* -------- unified load / submit -------- */
async function loadReviews(){
  if(window.apiReady()){
    try{
      const res = await fetch(`${window.API_BASE}/reviews`);
      if(!res.ok) throw new Error('bad response');
      return await res.json();
    }catch(err){
      console.warn('Backend unavailable, showing local reviews instead:', err);
      return getLocalReviews().slice().reverse();
    }
  }
  console.info('Reviews are currently saved per-browser only. Deploy /backend and set js/api-config.js to share them with every visitor.');
  return getLocalReviews().slice().reverse();
}

async function submitReview(review){
  if(window.apiReady()){
    const res = await fetch(`${window.API_BASE}/reviews`, {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify(review)
    });
    if(!res.ok){
      const data = await res.json().catch(()=>({}));
      throw new Error(data.error || 'Could not save your review — please try again.');
    }
    return;
  }
  saveLocalReview(review);
}

window.addEventListener('DOMContentLoaded', async ()=>{
  const reviews = await loadReviews();
  renderList(reviews);

  const form = document.getElementById('reviewForm');
  if(form){
    const user = JSON.parse(localStorage.getItem('ahri_current_user') || 'null');
    const nameField = document.getElementById('revName');
    if(user && nameField){ nameField.value = user.name; }

    form.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const msg = document.getElementById('revMsg');
      const name = document.getElementById('revName').value.trim();
      const role = document.getElementById('revRole').value.trim();
      const rating = parseInt(document.getElementById('revRating').value, 10);
      const text = document.getElementById('revText').value.trim();
      if(!name || !text){
        msg.textContent = 'Please add your name and a short review.';
        msg.className = 'form-msg show err';
        return;
      }
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Publishing…';

      try{
        await submitReview({name, role, rating, text});
        const updated = await loadReviews();
        renderList(updated);
        form.reset();
        msg.textContent = 'Thank you! Your review is now published above.';
        msg.className = 'form-msg show ok';
      }catch(err){
        msg.textContent = err.message;
        msg.className = 'form-msg show err';
      }finally{
        submitBtn.disabled = false;
        submitBtn.textContent = 'Publish Review';
      }
    });
  }
});
