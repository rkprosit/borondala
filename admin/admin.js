(function () {
  'use strict';

  var cfg = window.SITE_CONFIG || {};
  var PLACEHOLDER = !cfg.supabaseAnonKey || cfg.supabaseAnonKey.indexOf('PASTE_') === 0;

  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  if (PLACEHOLDER) {
    $('setupNotice').classList.remove('hidden');
    $('loginView').classList.add('hidden');
    return;
  }

  var sb = supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);

  function toast(msg) {
    var t = $('toast');
    t.textContent = msg;
    t.classList.remove('hidden');
    clearTimeout(toast._h);
    toast._h = setTimeout(function () { t.classList.add('hidden'); }, 2600);
  }

  function show(view) {
    $('loginView').classList.toggle('hidden', view !== 'login');
    $('appView').classList.toggle('hidden', view !== 'app');
  }

  async function refreshAuthView() {
    var session = await sb.auth.getSession();
    if (session.data && session.data.session) {
      show('app');
      $('userEmail').textContent = session.data.session.user.email || '';
      loadLeads();
      loadPortfolio();
      loadVideos();
      loadTestimonials();
      loadPackages();
    } else {
      show('login');
    }
  }

  $('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    var btn = $('loginBtn');
    var err = $('loginError');
    err.classList.add('hidden');
    btn.disabled = true;
    var res = await sb.auth.signInWithPassword({
      email: $('loginEmail').value.trim(),
      password: $('loginPassword').value
    });
    btn.disabled = false;
    if (res.error) {
      err.textContent = res.error.message;
      err.classList.remove('hidden');
      return;
    }
    refreshAuthView();
  });

  $('logoutBtn').addEventListener('click', function () {
    sb.auth.signOut().then(function () { show('login'); });
  });

  $('tabs').addEventListener('click', function (e) {
    var btn = e.target.closest('button[data-tab]');
    if (!btn) return;
    document.querySelectorAll('#tabs button').forEach(function (b) { b.classList.toggle('active', b === btn); });
    document.querySelectorAll('.tab-panel').forEach(function (p) { p.classList.add('hidden'); });
    $('tab-' + btn.dataset.tab).classList.remove('hidden');
  });

  function ytid(url) {
    var m = String(url).match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    return m ? m[1] : '';
  }

  function thumbFor(url) {
    var id = ytid(url);
    return id ? 'https://img.youtube.com/vi/' + id + '/mqdefault.jpg' : '';
  }

  /* ---------------- Leads ---------------- */

  async function loadLeads() {
    var list = $('leadsList');
    list.innerHTML = '<p class="muted">Loading...</p>';
    var res = await sb.from('leads').select('*').order('created_at', { ascending: false }).limit(200);
    if (res.error) { list.innerHTML = '<p class="error">' + esc(res.error.message) + '</p>'; return; }
    var rows = res.data || [];
    var unread = rows.filter(function (r) { return !r.is_read; }).length;
    var badge = $('leadBadge');
    badge.classList.toggle('hidden', unread === 0);
    badge.textContent = unread;
    if (!rows.length) { list.innerHTML = '<p class="muted">No leads yet.</p>'; return; }
    list.innerHTML = '';
    rows.forEach(function (r) {
      var card = document.createElement('div');
      card.className = 'lead-card' + (r.is_read ? ' read' : '');
      card.innerHTML =
        '<div class="lead-top">' +
          '<h3>' + esc(r.name) + '</h3>' +
          (r.is_read ? '<span class="tag">read</span>' : '<span class="tag new">NEW</span>') +
          '<span class="tag">' + esc(r.source) + '</span>' +
          (r.plan_type ? '<span class="tag">' + esc(r.plan_type) + '</span>' : '') +
          '<span class="muted">' + new Date(r.created_at).toLocaleString() + '</span>' +
        '</div>' +
        '<div class="lead-meta">' +
          (r.email ? '<div>Email: <b>' + esc(r.email) + '</b></div>' : '') +
          (r.phone ? '<div>Phone: <b>' + esc(r.phone) + '</b></div>' : '') +
          (r.event_type ? '<div>Event: <b>' + esc(r.event_type) + '</b></div>' : '') +
          (r.event_date ? '<div>Date: <b>' + esc(r.event_date) + '</b></div>' : '') +
          (r.budget ? '<div>Budget: <b>' + esc(r.budget) + '</b></div>' : '') +
        '</div>' +
        (r.details ? '<div class="lead-details">' + esc(r.details) + '</div>' : '') +
        '<div class="lead-actions">' +
          '<button class="btn-ghost" data-act="toggle" data-id="' + r.id + '" data-read="' + (r.is_read ? '1' : '0') + '">' + (r.is_read ? 'Mark unread' : 'Mark read') + '</button>' +
          (r.phone ? '<a class="btn-ghost" style="text-decoration:none" target="_blank" rel="noopener noreferrer" href="https://wa.me/' + esc(String(r.phone).replace(/[^0-9]/g, '')) + '">WhatsApp</a>' : '') +
          '<button class="btn-danger" data-act="del" data-id="' + r.id + '">Delete</button>' +
        '</div>';
      list.appendChild(card);
    });
  }

  $('leadsList').addEventListener('click', async function (e) {
    var btn = e.target.closest('button[data-act]');
    if (!btn) return;
    var id = btn.dataset.id;
    if (btn.dataset.act === 'toggle') {
      await sb.from('leads').update({ is_read: btn.dataset.read !== '1' }).eq('id', id);
      loadLeads();
    } else if (btn.dataset.act === 'del') {
      if (confirm('Delete this lead?')) {
        await sb.from('leads').delete().eq('id', id);
        loadLeads();
      }
    }
  });

  $('refreshLeads').addEventListener('click', loadLeads);

  /* ---------------- Portfolio ---------------- */

  var CATEGORIES = ['wedding', 'prewedding', 'babyshower', 'babyshoot', 'modelshoot', 'event'];

  async function loadPortfolio() {
    var list = $('portfolioList');
    list.innerHTML = '<p class="muted">Loading...</p>';
    var res = await sb.from('portfolio_items').select('*').order('sort_order').order('created_at');
    if (res.error) { list.innerHTML = '<p class="error">' + esc(res.error.message) + '</p>'; return; }
    var rows = res.data || [];
    $('portfolioCount').textContent = rows.length + ' items';
    list.innerHTML = '';
    rows.forEach(function (r) {
      var card = document.createElement('div');
      card.className = 'item-card';
      card.innerHTML =
        '<img class="thumb" src="' + esc(r.image_url) + '" alt="" loading="lazy">' +
        '<div class="fields">' +
          '<input type="text" data-f="title" value="' + esc(r.title) + '">' +
          '<select data-f="category">' + CATEGORIES.map(function (c) {
            return '<option value="' + c + '"' + (c === r.category ? ' selected' : '') + '>' + c + '</option>';
          }).join('') + '</select>' +
          '<input type="number" data-f="sort_order" value="' + (+r.sort_order || 0) + '">' +
          '<label class="chk"><input type="checkbox" data-f="is_visible"' + (r.is_visible ? ' checked' : '') + '> visible</label>' +
        '</div>' +
        '<div class="actions">' +
          '<button class="btn-primary" data-save="' + r.id + '">Save</button>' +
          '<button class="btn-danger" data-del="' + r.id + '" data-path="' + esc(r.storage_path || '') + '">Delete</button>' +
        '</div>';
      list.appendChild(card);
    });
  }

  $('portfolioAddForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    var status = $('pfStatus');
    var fileInput = $('pfFile');
    var file = fileInput.files[0];
    if (!file) { status.textContent = 'Choose an image first.'; return; }
    status.textContent = 'Uploading...';
    var path = new Date().getFullYear() + '/' + Date.now() + '-' + file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    var up = await sb.storage.from('portfolio').upload(path, file, { cacheControl: '31536000', upsert: false });
    if (up.error) { status.textContent = 'Upload failed: ' + up.error.message; return; }
    var pub = sb.storage.from('portfolio').getPublicUrl(path);
    var ins = await sb.from('portfolio_items').insert({
      title: $('pfTitle').value.trim(),
      category: $('pfCategory').value,
      sort_order: parseInt($('pfSort').value, 10) || 0,
      image_url: pub.data.publicUrl,
      storage_path: path
    });
    if (ins.error) { status.textContent = 'Save failed: ' + ins.error.message; return; }
    status.textContent = 'Done.';
    e.target.reset();
    $('pfSort').value = 0;
    loadPortfolio();
    toast('Photo added');
  });

  $('portfolioList').addEventListener('click', async function (e) {
    var saveBtn = e.target.closest('[data-save]');
    var delBtn = e.target.closest('[data-del]');
    if (saveBtn) {
      var card = saveBtn.closest('.item-card');
      var patch = {};
      card.querySelectorAll('[data-f]').forEach(function (el) {
        patch[el.dataset.f] = el.type === 'checkbox' ? el.checked
          : el.dataset.f === 'sort_order' ? (parseInt(el.value, 10) || 0)
          : el.value;
      });
      var res = await sb.from('portfolio_items').update(patch).eq('id', saveBtn.dataset.save);
      toast(res.error ? 'Save failed: ' + res.error.message : 'Saved');
      if (!res.error) loadPortfolio();
    } else if (delBtn) {
      if (!confirm('Delete this photo? It will be removed from the website.')) return;
      btnDelPhoto(delBtn);
    }
  });

  async function btnDelPhoto(delBtn) {
    delBtn.disabled = true;
    delBtn.textContent = 'Deleting...';
    var path = delBtn.dataset.path;
    if (path) {
      var rm = await sb.storage.from('portfolio').remove([path]);
      if (rm.error) toast('Storage cleanup warning: ' + rm.error.message);
    }
    var res = await sb.from('portfolio_items').delete().eq('id', delBtn.dataset.del);
    if (res.error) { toast('Delete failed: ' + res.error.message); delBtn.disabled = false; delBtn.textContent = 'Delete'; return; }
    toast('Photo deleted');
    loadPortfolio();
  }

  $('importGalleryBtn').addEventListener('click', async function () {
    var btn = this;
    if (!confirm('Scan the current homepage and add all its photos to the portfolio manager?')) return;
    btn.disabled = true;
    btn.textContent = 'Importing...';
    try {
      var html = await fetch('/index.html', { cache: 'no-store' }).then(function (r) { return r.text(); });
      var doc = new DOMParser().parseFromString(html, 'text/html');
      var nodes = Array.from(doc.querySelectorAll('.portfolio-item'));
      if (!nodes.length) { toast('No photos found on the page.'); return; }
      var existing = new Set((await sb.from('portfolio_items').select('image_url')).data
        .map(function (r) { return r.image_url.replace(/^https?:\/\/[^/]+/, ''); }));
      var rows = [];
      nodes.forEach(function (node, i) {
        var img = node.querySelector('img');
        if (!img || !img.getAttribute('src')) return;
        var url = img.getAttribute('src');
        if (url.indexOf('/') !== 0 && !/^https?:/.test(url)) url = '/' + url;
        if (existing.has(url)) return;
        existing.add(url);
        var label = node.querySelector('.portfolio-overlay span');
        rows.push({
          title: (node.querySelector('.portfolio-overlay h3') || {}).textContent || ('Photo ' + (i + 1)),
          category: node.dataset.category || 'wedding',
          image_url: url,
          sort_order: i,
          is_visible: true
        });
      });
      if (!rows.length) { toast('All photos are already imported.'); return; }
      for (var i = 0; i < rows.length; i += 50) {
        var ins = await sb.from('portfolio_items').insert(rows.slice(i, i + 50));
        if (ins.error) { toast('Import error: ' + ins.error.message); break; }
      }
      toast(rows.length + ' photos imported');
      loadPortfolio();
    } catch (err) {
      toast('Import failed: ' + err.message);
    } finally {
      btn.disabled = false;
      btn.textContent = 'Import existing gallery';
    }
  });

  /* ---------------- Videos ---------------- */

  async function loadVideos() {
    var list = $('videoList');
    list.innerHTML = '<p class="muted">Loading...</p>';
    var res = await sb.from('videos').select('*').order('sort_order').order('created_at');
    if (res.error) { list.innerHTML = '<p class="error">' + esc(res.error.message) + '</p>'; return; }
    list.innerHTML = '';
    (res.data || []).forEach(function (r) {
      var thumb = thumbFor(r.url);
      var card = document.createElement('div');
      card.className = 'item-card';
      card.innerHTML =
        '<div class="thumb-wrap">' + (thumb ? '<img src="' + esc(thumb) + '" alt="" loading="lazy">' : '') + '</div>' +
        '<div class="fields">' +
          '<input type="text" data-f="title" value="' + esc(r.title) + '">' +
          '<input type="text" data-f="subtitle" value="' + esc(r.subtitle || '') + '" placeholder="Subtitle">' +
          '<input type="url" data-f="url" value="' + esc(r.url) + '">' +
          '<input type="number" data-f="sort_order" value="' + (+r.sort_order || 0) + '">' +
          '<label class="chk"><input type="checkbox" data-f="is_visible"' + (r.is_visible ? ' checked' : '') + '> visible</label>' +
        '</div>' +
        '<div class="actions">' +
          '<button class="btn-primary" data-save="' + r.id + '">Save</button>' +
          '<button class="btn-danger" data-del="' + r.id + '">Delete</button>' +
        '</div>';
      list.appendChild(card);
    });
  }

  $('videoAddForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    var status = $('vdStatus');
    var url = $('vdUrl').value.trim();
    if (!ytid(url)) { status.textContent = 'Not a valid YouTube URL.'; return; }
    var ins = await sb.from('videos').insert({
      title: $('vdTitle').value.trim(),
      subtitle: $('vdSubtitle').value.trim(),
      url: url,
      sort_order: parseInt($('vdSort').value, 10) || 0
    });
    if (ins.error) { status.textContent = ins.error.message; return; }
    status.textContent = 'Done.';
    e.target.reset();
    $('vdSort').value = 0;
    loadVideos();
    toast('Video added');
  });

  $('videoList').addEventListener('click', async function (e) {
    var saveBtn = e.target.closest('[data-save]');
    var delBtn = e.target.closest('[data-del]');
    if (saveBtn) {
      var card = saveBtn.closest('.item-card');
      var patch = {};
      card.querySelectorAll('[data-f]').forEach(function (el) {
        patch[el.dataset.f] = el.type === 'checkbox' ? el.checked
          : el.dataset.f === 'sort_order' ? (parseInt(el.value, 10) || 0)
          : el.value;
      });
      var res = await sb.from('videos').update(patch).eq('id', saveBtn.dataset.save);
      toast(res.error ? 'Save failed: ' + res.error.message : 'Saved');
      if (!res.error) loadVideos();
    } else if (delBtn) {
      if (!confirm('Delete this video?')) return;
      await sb.from('videos').delete().eq('id', delBtn.dataset.del);
      loadVideos();
      toast('Deleted');
    }
  });

  /* ---------------- Testimonials ---------------- */

  async function loadTestimonials() {
    var list = $('testimonialList');
    list.innerHTML = '<p class="muted">Loading...</p>';
    var res = await sb.from('testimonials').select('*').order('sort_order').order('created_at');
    if (res.error) { list.innerHTML = '<p class="error">' + esc(res.error.message) + '</p>'; return; }
    list.innerHTML = '';
    (res.data || []).forEach(function (r) {
      var card = document.createElement('div');
      card.className = 'row-card';
      card.innerHTML =
        '<form data-edit="' + r.id + '">' +
          '<input type="text" name="name" value="' + esc(r.name) + '" required>' +
          '<input type="text" name="label" value="' + esc(r.label) + '" placeholder="Label">' +
          '<input type="number" name="sort_order" value="' + (+r.sort_order || 0) + '" style="flex:0 1 90px;">' +
          '<label class="chk"><input type="checkbox" name="is_visible"' + (r.is_visible ? ' checked' : '') + '> visible</label>' +
          '<textarea name="quote" required>' + esc(r.quote) + '</textarea>' +
          '<button type="submit" class="btn-primary">Save</button>' +
          '<button type="button" class="btn-danger" data-del="' + r.id + '">Delete</button>' +
        '</form>';
      list.appendChild(card);
    });
  }

  $('testimonialAddForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    var ins = await sb.from('testimonials').insert({
      name: $('tmName').value.trim(),
      label: $('tmLabel').value.trim(),
      quote: $('tmQuote').value.trim()
    });
    if (ins.error) { $('tmStatus').textContent = ins.error.message; return; }
    $('tmStatus').textContent = 'Done.';
    e.target.reset();
    loadTestimonials();
    toast('Testimonial added');
  });

  $('testimonialList').addEventListener('submit', async function (e) {
    var form = e.target.closest('form[data-edit]');
    if (!form) return;
    e.preventDefault();
    var f = form.elements;
    var res = await sb.from('testimonials').update({
      name: f.name.value.trim(),
      label: f.label.value.trim(),
      quote: f.quote.value.trim(),
      sort_order: parseInt(f.sort_order.value, 10) || 0,
      is_visible: f.is_visible.checked
    }).eq('id', form.dataset.edit);
    toast(res.error ? 'Save failed: ' + res.error.message : 'Saved');
    if (!res.error) loadTestimonials();
  });

  $('testimonialList').addEventListener('click', async function (e) {
    var btn = e.target.closest('[data-del]');
    if (!btn || !confirm('Delete this testimonial?')) return;
    await sb.from('testimonials').delete().eq('id', btn.dataset.del);
    loadTestimonials();
    toast('Deleted');
  });

  /* ---------------- Packages ---------------- */

  async function loadPackages() {
    var list = $('packageList');
    list.innerHTML = '<p class="muted">Loading...</p>';
    var res = await sb.from('packages').select('*').order('sort_order').order('created_at');
    if (res.error) { list.innerHTML = '<p class="error">' + esc(res.error.message) + '</p>'; return; }
    list.innerHTML = '';
    (res.data || []).forEach(function (r) {
      var features = Array.isArray(r.features) ? r.features : [];
      var card = document.createElement('div');
      card.className = 'row-card';
      card.innerHTML =
        '<form data-edit="' + r.id + '">' +
          '<div class="row">' +
            '<input type="text" name="title" value="' + esc(r.title) + '" required>' +
            '<input type="text" name="price" value="' + esc(r.price || '') + '" placeholder="Price">' +
            '<input type="text" name="tagline" value="' + esc(r.tagline || '') + '" placeholder="Tagline">' +
            '<label class="chk"><input type="checkbox" name="is_popular"' + (r.is_popular ? ' checked' : '') + '> popular</label>' +
            '<label class="chk"><input type="checkbox" name="is_visible"' + (r.is_visible ? ' checked' : '') + '> visible</label>' +
            '<input type="number" name="sort_order" value="' + (+r.sort_order || 0) + '" style="flex:0 1 90px;">' +
          '</div>' +
          '<textarea name="features">' + esc(features.join('\n')) + '</textarea>' +
          '<div><button type="submit" class="btn-primary">Save</button> ' +
          '<button type="button" class="btn-danger" data-del="' + r.id + '">Delete</button></div>' +
        '</form>';
      list.appendChild(card);
    });
  }

  $('packageAddForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    var features = $('pkFeatures').value.split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
    var ins = await sb.from('packages').insert({
      title: $('pkTitle').value.trim(),
      tagline: $('pkTagline').value.trim(),
      price: $('pkPrice').value.trim(),
      is_popular: $('pkPopular').checked,
      features: features
    });
    if (ins.error) { $('pkStatus').textContent = ins.error.message; return; }
    $('pkStatus').textContent = 'Done.';
    e.target.reset();
    loadPackages();
    toast('Package added');
  });

  $('packageList').addEventListener('submit', async function (e) {
    var form = e.target.closest('form[data-edit]');
    if (!form) return;
    e.preventDefault();
    var f = form.elements;
    var res = await sb.from('packages').update({
      title: f.title.value.trim(),
      price: f.price.value.trim(),
      tagline: f.tagline.value.trim(),
      is_popular: f.is_popular.checked,
      is_visible: f.is_visible.checked,
      sort_order: parseInt(f.sort_order.value, 10) || 0,
      features: f.features.value.split('\n').map(function (s) { return s.trim(); }).filter(Boolean)
    }).eq('id', form.dataset.edit);
    toast(res.error ? 'Save failed: ' + res.error.message : 'Saved');
    if (!res.error) loadPackages();
  });

  $('packageList').addEventListener('click', async function (e) {
    var btn = e.target.closest('[data-del]');
    if (!btn || !confirm('Delete this package?')) return;
    await sb.from('packages').delete().eq('id', btn.dataset.del);
    loadPackages();
    toast('Deleted');
  });

  /* ---------------- Boot ---------------- */

  sb.auth.onAuthStateChange(function () { refreshAuthView(); });
  refreshAuthView();
})();
