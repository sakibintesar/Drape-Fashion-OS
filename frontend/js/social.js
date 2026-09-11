// @ts-check
// ── SOCIAL.JS ──
// Social media hub: overview stats, platform post rendering, post scheduling,
// scheduled post management, and AI caption generation.

const socialPosts = {
  instagram: [
    { text: 'New drop 🌿 The Muslin Wrap Dress by LOOM & GRACE is now live. Link in bio. #DRAPE #DhakaFashion #SustainableStyle', emoji: '👗', likes: 842, comments: 67, status: 'live', date: '2026-06-20' },
    { text: 'Behind the scenes at NAKSHI STUDIO, Rajshahi. 220 artisans. Every stitch, intentional. #EthicalFashion #NakshiKantha', emoji: '🎨', likes: 1204, comments: 112, status: 'live', date: '2026-06-18' },
    { text: 'The Linen Blazer is on SALE. 20% off this week only. Link in bio 🔥', emoji: '🧥', likes: 634, comments: 44, status: 'live', date: '2026-06-15' },
    { text: 'Upcoming: The SS/26 Collection drops next week. Stay tuned ✨', emoji: '✨', likes: 0, comments: 0, status: 'scheduled', date: '2026-06-28' },
  ],
  facebook: [
    { text: 'DRAPE x THREAD REPUBLIC: Recycled knitwear that looks like a million takas. Shop now at drape.fashion 🔗', emoji: '✂️', likes: 312, comments: 28, status: 'live', date: '2026-06-19' },
    { text: 'We just added 10 new products to the catalog — including the Brass Cuff Set from ADORN CO. Check out the full collection.', emoji: '📿', likes: 198, comments: 15, status: 'live', date: '2026-06-17' },
  ],
  tiktok: [
    { text: "POV: You just found Bangladesh's most ethical fashion brand 🇧🇩 #DRAPE #FashionTok #Bangladesh", emoji: '🎬', likes: 4200, comments: 234, status: 'live', date: '2026-06-21' },
    { text: 'GRWM: Wearing DRAPE head to toe for a wedding in Dhaka ✨ #OOTD #DhakaFashion #WeddingStyle', emoji: '🎵', likes: 8100, comments: 445, status: 'live', date: '2026-06-16' },
  ],
  linkedin: [
    { text: 'Building a fashion company that runs entirely on systems. No spreadsheets. No gut calls. Just data, design, and five incredible artisan brand partners. Thread on what DRAPE FashionOS looks like under the hood 👇', emoji: '💼', likes: 87, comments: 22, status: 'live', date: '2026-06-18' },
    { text: "We're hiring a Head of Growth. If you've scaled a D2C brand in South Asia and care about craft + sustainability — DM me.", emoji: '📢', likes: 143, comments: 38, status: 'live', date: '2026-06-12' },
  ],
};

// ─── SOCIAL OVERVIEW ───
function renderSocialOverview() {
  const total = 12400 + 8100 + 6200 + 2100;
  const sf = document.getElementById('soc_followers');
  if (sf) sf.textContent = (total / 1000).toFixed(1) + 'K';
  const sr = document.getElementById('soc_reach');
  if (sr) sr.textContent = '84.2K';
  const platforms = [
    { icon: '📸', bg: 'linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)', name: 'Instagram', handle: '@drape.fashion', followers: '12.4K', posts: 342, eng: '5.2%' },
    { icon: '👥', bg: '#1877F2', name: 'Facebook', handle: 'drape.fashion.bd', followers: '8.1K', posts: 156, eng: '3.9%' },
    { icon: '🎵', bg: '#000', name: 'TikTok', handle: '@drape.fashion', followers: '6.2K', posts: 48, eng: '7.1%' },
    { icon: '💼', bg: '#0A66C2', name: 'LinkedIn', handle: 'drape-fashion-bd', followers: '2.1K', posts: 34, eng: '2.3%' },
  ];
  const pc = document.getElementById('platformCards');
  if (pc) pc.innerHTML = platforms.map(p => `
    <div class="platform-card" style="margin-bottom:2px">
      <div class="platform-header">
        <div class="platform-icon" style="background:${p.bg}">${p.icon}</div>
        <div class="platform-info"><div class="platform-name">${p.name}</div><div class="platform-handle">${p.handle}</div></div>
        <div class="platform-stats">
          <div class="plat-stat"><div class="plat-stat-val">${p.followers}</div><div class="plat-stat-key">Followers</div></div>
          <div class="plat-stat"><div class="plat-stat-val">${p.posts}</div><div class="plat-stat-key">Posts</div></div>
          <div class="plat-stat"><div class="plat-stat-val">${p.eng}</div><div class="plat-stat-key">Eng.Rate</div></div>
        </div>
      </div>
    </div>`).join('');
}
function renderPlatformPosts(platform, gridId) {
  const posts = socialPosts[platform] || [];
  const el = document.getElementById(gridId);
  if (el) el.innerHTML = posts.map(p => `
    <div class="post-card">
      <div class="post-card-img">${p.emoji}</div>
      <div class="post-card-body">
        <div class="post-card-status status-${p.status}">${p.status.toUpperCase()}</div>
        <div class="post-card-text">${escapeHtml(p.text.substring(0, 90))}${p.text.length > 90 ? '...' : ''}</div>
        <div class="post-card-stats">
          <span class="post-card-stat">❤ ${p.likes.toLocaleString()}</span>
          <span class="post-card-stat">💬 ${p.comments}</span>
          <span class="post-card-stat mono" style="font-size:9px">${p.date}</span>
        </div>
      </div>
    </div>`).join('') || '<div style="padding:32px;color:var(--slate);font-size:12px">No posts yet.</div>';
}

// ─── SCHEDULING ───
function renderSchedule() {
  const sb = document.getElementById('scheduleBody');
  if (sb) sb.innerHTML = scheduledPosts.length ?
    scheduledPosts.map((p, i) => `<tr>
      <td style="font-size:11px">${escapeHtml(p.platform)}</td>
      <td style="font-size:11px;max-width:200px">${escapeHtml(p.content.substring(0, 60))}...</td>
      <td style="font-size:11px;font-family:'DM Mono',monospace">${p.datetime}</td>
      <td><span class="status-badge badge-pending">Scheduled</span></td>
      <td><button class="admin-btn sm danger" onclick="removeScheduled(${i})">✗</button></td>
    </tr>`).join('') :
    '<tr><td colspan="5" style="text-align:center;color:var(--slate);padding:24px;font-size:12px">No scheduled posts. Create one above.</td></tr>';
}
function removeScheduled(i) { scheduledPosts.splice(i, 1); renderSchedule(); saveState(); showToast('Post removed.'); }
function updateCharCount(taId, countId, max) {
  const v = document.getElementById(taId)?.value?.length || 0;
  const el = document.getElementById(countId);
  if (el) el.textContent = v + ' / ' + max;
}

// AI Caption via backend proxy (API key never exposed to frontend)
async function aiCaption(platform) {
  const taid = { instagram: 'ig_caption', facebook: 'fb_caption', tiktok: 'tt_caption', linkedin: 'li_caption', scheduler: 'sch_content' };
  const ta = document.getElementById(taid[platform]);
  if (!ta) return;
  ta.value = '✨ Generating...'; ta.disabled = true;
  try {
    const token = localStorage.getItem('drape_token');
    const res = await fetch(`${API_BASE}/ai/caption`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      },
      body: JSON.stringify({ platform })
    });
    if (!res.ok) throw new Error('AI service error');
    const data = await res.json();
    ta.value = data.text || 'Could not generate caption.';
  } catch (e) {
    const mockCaptions = {
      instagram: '✨ New drop alert! The SS/26 collection is here — 5 artisan brands, one vision. Crafted in Dhaka, worn everywhere. Which piece speaks to you? 🌿\n\n#DRAPE #DhakaFashion #SustainableStyle #SlowFashion #Bangladesh #ArtisanMade',
      facebook: 'We are thrilled to share the stories behind every stitch. This season, DRAPE partners with 5 incredible artisan brands — from handloom weavers in Old Dhaka to kantha embroiders in Rajshahi. Every purchase supports fair wages and keeps heritage craft alive. Thank you for being part of this journey. 💚',
      tiktok: 'POV: you discover Bangladesh\'s most ethical fashion brand 🇧🇩\n\nHook: "I thought sustainable fashion had to be expensive... then I found DRAPE."\n\n#DRAPE #FashionTok #Bangladesh #OOTD #SustainableStyle',
      linkedin: 'Building a fashion company that runs entirely on systems. No spreadsheets. No gut calls. Just data, design, and five incredible artisan brand partners. Here is what DRAPE FashionOS looks like under the hood. 👇',
      scheduler: '✨ New drop! The SS/26 collection is live. 5 artisan brands, crafted in Dhaka. Shop the full collection at drape.fashion. 🌿 #DRAPE #DhakaFashion #SustainableStyle'
    };
    ta.value = mockCaptions[platform] || mockCaptions.scheduler;
  }
  ta.disabled = false;
}
function schedulePost(platform) {
  const taid = { instagram: 'ig_caption', facebook: 'fb_caption', tiktok: 'tt_caption', linkedin: 'li_caption' };
  const content = document.getElementById(taid[platform])?.value;
  if (!content) { showToast('Write some content first.', 'error'); return; }
  socialPosts[platform] = socialPosts[platform] || [];
  socialPosts[platform].unshift({ text: content, emoji: '📝', likes: 0, comments: 0, status: 'live', date: new Date().toISOString().split('T')[0] });
  renderPlatformPosts(platform, { instagram: 'igPostsGrid', facebook: 'fbPostsGrid', tiktok: 'ttPostsGrid', linkedin: 'liPostsGrid' }[platform]);
  const ta = document.getElementById(taid[platform]);
  if (ta) ta.value = '';
  showToast('Post published to ' + platform + '!', 'success');
}
function scheduleSave() {
  const content = document.getElementById('sch_content').value;
  const platform = document.getElementById('sch_platform').value;
  const dt = document.getElementById('sch_datetime').value;
  if (!content || !dt) { showToast('Fill content and date.', 'error'); return; }
  scheduledPosts.push({ content, platform, datetime: dt.replace('T', ' ') });
  document.getElementById('sch_content').value = '';
  renderSchedule(); saveState(); showToast('Post scheduled!', 'success');
}

// ── EXPORT TO WINDOW ──
window.renderSocialOverview = renderSocialOverview;
window.renderPlatformPosts = renderPlatformPosts;
window.renderSchedule = renderSchedule;
window.removeScheduled = removeScheduled;
window.updateCharCount = updateCharCount;
window.aiCaption = aiCaption;
window.schedulePost = schedulePost;
window.scheduleSave = scheduleSave;
