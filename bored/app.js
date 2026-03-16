const state = {
  xp: 0,
  level: 1,
  completed: 0,
  xpPerLevel: 100,
};

const categoryNames = {
  education: 'Bildung',
  recreational: 'Freizeit',
  social: 'Soziales',
  diy: 'DIY',
  charity: 'Charity',
  cooking: 'Kochen',
  relaxation: 'Entspannung',
  music: 'Musik',
  busywork: 'Arbeit',
};

function loadState() {
  const saved = localStorage.getItem('boredState');
  if (saved) {
    const parsed = JSON.parse(saved);
    Object.assign(state, parsed);
  }
  updateUI();
}

function saveState() {
  localStorage.setItem('boredState', JSON.stringify(state));
}

function addXP(amount) {
  state.xp += amount;
  while (state.xp >= state.xpPerLevel) {
    state.xp -= state.xpPerLevel;
    state.level++;
    state.xpPerLevel = Math.floor(state.xpPerLevel * 1.2);
  }
  state.completed++;
  saveState();
  updateUI();
}

function updateUI() {
  document.getElementById('level').textContent = state.level;
  document.getElementById('xp').textContent = `${state.xp} / ${state.xpPerLevel}`;
  document.getElementById('completed').textContent = state.completed;
}

async function fetchActivity() {
  const btn = document.getElementById('boredBtn');
  const placeholder = document.getElementById('placeholder');
  const activityContent = document.getElementById('activityContent');
  const activityText = document.getElementById('activityText');
  const category = document.getElementById('category');
  const card = document.getElementById('activityCard');

  btn.disabled = true;
  btn.textContent = '⏳ Suche...';
  placeholder.innerHTML = '<p class="loading">Suche eine Aktivität...</p>';

  try {
    const res = await fetch('https://bored-api.appbrewery.com/random');
    if (!res.ok) throw new Error('API Error');
    const data = await res.json();

    const categoryText = categoryNames[data.type] || data.type;

    placeholder.classList.add('hidden');
    activityContent.classList.remove('hidden');
    activityText.textContent = data.activity;
    category.textContent = categoryText;
    card.classList.add('has-activity');

    btn.textContent = '🔄 Neue Aktivität';
    btn.disabled = false;
  } catch (err) {
    placeholder.innerHTML = '<p>😕 Keine Aktivität gefunden. Nochmal!</p>';
    btn.textContent = '😩 Ich langweile mich!';
    btn.disabled = false;
  }
}

function markDone() {
  const card = document.getElementById('activityCard');
  const placeholder = document.getElementById('placeholder');
  const activityContent = document.getElementById('activityContent');

  addXP(25);

  card.classList.remove('has-activity');
  activityContent.classList.add('hidden');
  placeholder.classList.remove('hidden');
  placeholder.innerHTML = '<p>Drück den Button wenn du dich langweilst!</p>';

  document.getElementById('boredBtn').textContent = '😩 Ich langweile mich!';
}

document.getElementById('boredBtn').addEventListener('click', fetchActivity);
document.getElementById('doneBtn').addEventListener('click', markDone);

loadState();
