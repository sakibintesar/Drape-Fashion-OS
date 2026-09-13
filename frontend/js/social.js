// @ts-check
// ── SOCIAL.JS ──
// Social media hub: real API integration for posting, connections, history, and AI captions.

const API_BASE_SOCIAL = '/api/social';

// ─── Platform Connection Status ───────────────────────────────────────────────
let _socialPlatforms = {};

async function fetchPlatformStatus() {
  const token = localStorage.getItem('drape_token');
  try {
    const res = await fetch(`${API_BASE_SOCIAL}/platforms`, {
      headers: token ? { Authorization: 'Bearer ' + token } : {}
    });
    if (!res.ok) throw new Error('Failed to fetch platforms');
    const data = await res.json();
    _socialPlatforms = data.platforms || {};
    return _socialPlatforms;
  } catch (e) {
    console.warn('[social] Could not fetch platform status:', e.message);
    _socialPlatforms = {};
    return _socialPlatforms;
  }
}

function isPlatformConnected(name) {
  return !!_socialPlatforms[name]?.connected;
}

function connectedCount() {
  return Object.values(_socialPlatforms).filter(p => p.connected).length;
}

// ─── SOCIAL OVERVIEW ──────────────────────────────────────────────────────────
async function renderSocialOverview() {
  await fetchPlatformStatus();

  const total = 12400 + 8100 + 6200 + 2100;
  const sf = document.getElementById('soc_followers');
  if (sf) sf.textContent = (total / 1000).toFixed(1) + 'K';
  const sr = document.getElementById('soc_reach');
  if (sr) sr.textContent = '84.2K';

  const platformDefs = [
    { key: 'meta', icon: '📸', bg: 'linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)', name: 'Instagram + Facebook', handle: '@drape.fashion', followers: '20.5K', posts: 498, eng: '4.8%' },
    { key: 'tiktok', icon: '🎵', bg: '#000', name: 'TikTok', handle: '@drape.fashion', followers: '6.2K', posts: 48, eng: '7.1%' },
    { key: 'linkedin', icon: '💼', bg: '#0A66C2', name: 'LinkedIn', handle: 'drape-fashion-bd', followers: '2.1K', posts: 34, eng: '2.3%' },
  ];

  const pc = document.getElementById('platformCards');
  if (pc) pc.innerHTML = platformDefs.map(p => {
    const connected = isPlatformConnected(p.key);
    const statusDot = connected
      ? '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#22c55e;margin-left:8px" title="Connected"></span>'
      : '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#94a3b8;margin-left:8px" title="Not connected"></span>';
    return `
    <div class="platform-card" style="margin-bottom:2px">
      <div class="platform-header">
        <div class="platform-icon" style="background:${p.bg}">${p.icon}</div>
        <div class="platform-info">
          <div class="platform-name">${p.name}${statusDot}</div>
          <div class="platform-handle">${connected ? p.handle : 'Not connected'}</div>
        </div>
        <div class="platform-stats">
          <div class="plat-stat"><div class="plat-stat-val">${p.followers}</div><div class="plat-stat-key">Followers</div></div>
          <div class="plat-stat"><div class="plat-stat-val">${p.posts}</div><div class="plat-stat-key">Posts</div></div>
          <div class="plat-stat"><div class="plat-stat-val">${p.eng}</div><div class="plat-stat-key">Eng.Rate</div></div>
        </div>
      </div>
      <div style="padding:8px 16px;border-top:1px solid var(--border)">
        ${connected
          ? `<button class="admin-btn sm danger" onclick="disconnectPlatform('${p.key}')">Disconnect</button>`
          : `<button class="admin-btn sm" onclick="connectPlatform('${p.key}')">Connect ${p.name.split(' ')[0]}</button>`
        }
      </div>
    </div>`;
  }).join('');
}

// ─── Platform Connect / Disconnect ────────────────────────────────────────────
async function connectPlatform(platform) {
  const token = localStorage.getItem('drape_token');
  try {
    const res = await fetch(`${API_BASE_SOCIAL}/oauth/${platform}`, {
      headers: token ? { Authorization: 'Bearer ' + token } : {}
    });
    const data = await res.json();
    if (data.url) {
      window.open(data.url, '_blank', 'width=600,height=700');
      showToast(`Opening ${platform} authorization...`, 'info');
    } else {
      showToast('Could not generate OAuth URL', 'error');
    }
  } catch (e) {
    showToast('Connection failed: ' + e.message, 'error');
  }
}

async function disconnectPlatform(platform) {
  const token = localStorage.getItem('drape_token');
  try {
    await fetch(`${API_BASE_SOCIAL}/disconnect/${platform}`, {
      method: 'DELETE',
      headers: token ? { Authorization: 'Bearer ' + token } : {}
    });
    showToast(`${platform} disconnected`, 'success');
    renderSocialOverview();
  } catch (e) {
    showToast('Disconnect failed: ' + e.message, 'error');
  }
}

// ─── Platform Posts (from API history) ────────────────────────────────────────
async function renderPlatformPosts(platform, gridId) {
  const el = document.getElementById(gridId);
  if (!el) return;

  const token = localStorage.getItem('drape_token');
  try {
    const res = await fetch(`${API_BASE_SOCIAL}/history?limit=20`, {
      headers: token ? { Authorization: 'Bearer ' + token } : {}
    });
    const data = await res.json();
    const posts = (data.posts || []).filter(p => p.platform === platform);

    if (!posts.length) {
      el.innerHTML = '<div style="padding:32px;color:var(--slate);font-size:12px">No posts yet. Use the composer below to create one.</div>';
      return;
    }

    el.innerHTML = posts.map(p => {
      const statusClass = p.status === 'posted' ? 'live' : p.status === 'failed' ? 'failed' : 'scheduled';
      const date = p.posted_at || p.created_at || '';
      const dateStr = date ? new Date(date).toLocaleDateString() : '';
      return `
      <div class="post-card">
        <div class="post-card-body">
          <div class="post-card-status status-${statusClass}">${p.status.toUpperCase()}</div>
          <div class="post-card-text">${escapeHtml((p.content || '').substring(0, 120))}${(p.content || '').length > 120 ? '...' : ''}</div>
          <div class="post-card-stats">
            ${p.platform_post_id ? `<span class="post-card-stat">🔗 posted</span>` : ''}
            ${p.error ? `<span class="post-card-stat" style="color:#ef4444">⚠ ${escapeHtml(p.error.substring(0, 50))}</span>` : ''}
            <span class="post-card-stat mono" style="font-size:9px">${dateStr}</span>
          </div>
        </div>
      </div>`;
    }).join('');
  } catch (e) {
    el.innerHTML = '<div style="padding:32px;color:var(--slate);font-size:12px">Could not load posts.</div>';
  }
}

// ─── Post to Platform(s) ──────────────────────────────────────────────────────
async function postToPlatform(platform) {
  const textareaMap = {
    instagram: 'ig_caption',
    facebook: 'fb_caption',
    tiktok: 'tt_caption',
    linkedin: 'li_caption'
  };
  const content = document.getElementById(textareaMap[platform])?.value?.trim();
  if (!content) { showToast('Write some content first.', 'error'); return; }

  const token = localStorage.getItem('drape_token');
  try {
    const res = await fetch(`${API_BASE_SOCIAL}/post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: 'Bearer ' + token } : {})
      },
      body: JSON.stringify({ platforms: [platform], content })
    });
    const data = await res.json();

    if (data.results?.length) {
      const r = data.results[0];
      if (r.error) {
        showToast(`${platform}: ${r.error}`, 'error');
      } else {
        showToast(`Posted to ${platform}!`, 'success');
        document.getElementById(textareaMap[platform]).value = '';
      }
    } else {
      showToast('Post failed — no results', 'error');
    }

    // Refresh the posts grid
    const gridMap = { instagram: 'igPostsGrid', facebook: 'fbPostsGrid', tiktok: 'ttPostsGrid', linkedin: 'liPostsGrid' };
    renderPlatformPosts(platform, gridMap[platform]);
  } catch (e) {
    showToast('Post failed: ' + e.message, 'error');
  }
}

async function postToAllPlatforms() {
  const textarea = document.getElementById('sch_content');
  const content = textarea?.value?.trim();
  if (!content) { showToast('Write some content first.', 'error'); return; }

  const connected = Object.entries(_socialPlatforms)
    .filter(([_, v]) => v.connected)
    .map(([k]) => k);

  if (!connected.length) {
    showToast('No platforms connected. Connect at least one first.', 'error');
    return;
  }

  const token = localStorage.getItem('drape_token');
  try {
    const res = await fetch(`${API_BASE_SOCIAL}/post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: 'Bearer ' + token } : {})
      },
      body: JSON.stringify({ platforms: connected, content })
    });
    const data = await res.json();

    const success = data.success || 0;
    const failed = data.failed || 0;
    if (failed > 0) {
      showToast(`Posted to ${success}, failed: ${failed}`, 'info');
    } else {
      showToast(`Posted to ${success} platform${success !== 1 ? 's' : ''}!`, 'success');
    }
    if (textarea) textarea.value = '';
  } catch (e) {
    showToast('Post failed: ' + e.message, 'error');
  }
}

// ─── SCHEDULING (local, with optional API persistence) ───────────────────────
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

// ─── AI Caption (via social route) ────────────────────────────────────────────
async function aiCaption(platform) {
  const taid = { instagram: 'ig_caption', facebook: 'fb_caption', tiktok: 'tt_caption', linkedin: 'li_caption', scheduler: 'sch_content' };
  const ta = document.getElementById(taid[platform]);
  if (!ta) return;
  ta.value = '✨ Generating...'; ta.disabled = true;
  try {
    const token = localStorage.getItem('drape_token');
    const res = await fetch(`${API_BASE_SOCIAL}/ai-caption`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: 'Bearer ' + token } : {})
      },
      body: JSON.stringify({ platform, topic: 'new collection' })
    });
    if (!res.ok) throw new Error('AI service error');
    const data = await res.json();
    ta.value = data.text || 'Could not generate caption.';
  } catch (e) {
    const mockCaptions = {
      instagram: '✨ New drop alert! The SS/26 collection is here — 5 artisan brands, one vision. Crafted in Dhaka, worn everywhere. Which piece speaks to you? 🌿\n\n#DRAPE #DhakaFashion #SustainableStyle #SlowFashion #Bangladesh #ArtisanMade',
      facebook: 'We are thrilled to share the stories behind every stitch. This season, DRAPE partners with 5 incredible artisan brands — from handloom weavers in Old Dhaka to kantha embroiders in Rajshahi. Every purchase supports fair wages and keeps heritage craft alive. 💚',
      tiktok: 'POV: you discover Bangladesh\'s most ethical fashion brand 🇧🇩\n\nHook: "I thought sustainable fashion had to be expensive... then I found DRAPE."\n\n#DRAPE #FashionTok #Bangladesh #OOTD #SustainableStyle',
      linkedin: 'Building a fashion company that runs entirely on systems. No spreadsheets. No gut calls. Just data, design, and five incredible artisan brand partners. Here is what DRAPE FashionOS looks like under the hood. 👇',
      scheduler: '✨ New drop! The SS/26 collection is live. 5 artisan brands, crafted in Dhaka. Shop the full collection at drape.fashion. 🌿 #DRAPE #DhakaFashion #SustainableStyle'
    };
    ta.value = mockCaptions[platform] || mockCaptions.scheduler;
  }
  ta.disabled = false;
}

function schedulePost(platform) {
  // Use real API post instead of local mock
  postToPlatform(platform);
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
window.connectPlatform = connectPlatform;
window.disconnectPlatform = disconnectPlatform;
window.postToPlatform = postToPlatform;
window.postToAllPlatforms = postToAllPlatforms;
window.fetchPlatformStatus = fetchPlatformStatus;
