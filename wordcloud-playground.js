/**
 * 워드클라우드 체험마당 — 네모 캔버스 꽉 채움, 모양 선택 없음
 */
(function () {
  'use strict';

  var MAX_CHARS = 32000;
  var MAX_WORDS = 200;
  var MIN_LEN = 2;

  var STOP = {
    이: 1, 가: 1, 을: 1, 를: 1, 의: 1, 에: 1, 에서: 1, 와: 1, 과: 1, 도: 1, 로: 1, 으로: 1,
    는: 1, 은: 1, 있다: 1, 없다: 1, 하다: 1, 되다: 1, 및: 1, 등: 1, 수: 1, 것: 1,
    the: 1, a: 1, an: 1, and: 1, or: 1, of: 1, to: 1, in: 1, for: 1, on: 1, with: 1,
    is: 1, are: 1, that: 1, this: 1, it: 1, as: 1, at: 1, by: 1, from: 1, be: 1,
  };

  var SAMPLE =
    '옛날 옛적 깊은 산골 마을에 세상에서 가장 당당한 고양이가 살았습니다. ' +
    '마을 사람들은 그를 별빛 고양이라 불렀지요. 낮이면 햇살 아래 낮잠을 자고 밤이면 달빛 마당을 지키며 쥐들을 쫓았습니다. ' +
    '어느 해 가을 호랑이가 마을 근처를 지나간다는 소문이 돌았습니다. 고양이는 용기를 내어 마을 앞 언덕에 올라 야옹하며 큰소리를 냈습니다. ' +
    '호랑이는 깜짝 놀라 숲속으로 달아났고 마을은 다시 평화로웠습니다. 그 뒤 아이들은 고양이에게 생선과 우유를 나눠 주었고 할머니는 따뜻한 담요를 덮어 주었습니다. ' +
    '봄에는 벚꽃 밭에서 뛰어놀고 여름에는 시냇물 가를 건넜습니다. 가을에는 노란 곶감을 바라보며 하늘을 보았고 겨울에는 눈 내린 지붕 위에서 별을 세었습니다. ' +
    '마을 어귀에는 오래된 우물이 있었고 고양이는 매일 아침 우물가에서 물결을 바라보았습니다. 바람이 불면 산등성이가 노래하고 비가 오면 초가집 지붕에서 물방울이 떨어졌습니다. ' +
    '어느 날 밤 하늘에서 반짝이는 별 하나가 고양이 앞으로 내려왔습니다. 별은 말했습니다. 용감한 마음을 가진 너에게 작은 선물을 주겠다고요. ' +
    '고양이는 별빛 실뭉치를 받아 마당에 둥그런 고리를 그렸고 그 안에서 친구들과 함께 춤을 추었습니다. 고양이 고양이 야옹이 냥이 집사 네모 하늘 별 워드클라우드 놀이터 재미있게 시험해 보세요. ' +
    '이 이야기처럼 여러분의 글도 붙여넣으면 단어 구름이 만들어집니다. 옛이야기 가사 일기 뉴스 보고서 무엇이든 좋습니다.';

  var COLORS = ['#3b9eff', '#5eb3ff', '#7ec8ff', '#9ecfff', '#c8e4ff', '#6dd5a8', '#f0b429'];

  var UPSELL = {
    lda: {
      ko: 'LDA 토픽 분석은 VibeStat-Text 시험판·정식판에서 로컬 R로 실행됩니다.',
      en: 'LDA topic modeling runs in VibeStat-Text (beta/formal) with built-in R.',
    },
    topic: {
      ko: '토픽·키워드 탐색은 데스크톱 프로그램에서 제공됩니다.',
      en: 'Topic exploration is available in the desktop app.',
    },
    compare: {
      ko: '문서 비교·TF-IDF는 VibeStat-Text에서 버튼으로 실행됩니다.',
      en: 'Document comparison runs via buttons in VibeStat-Text.',
    },
  };

  var booted = false;
  var isKo = false;
  var modal;
  var upsellModal;
  var canvas;
  var textarea;
  var statusEl;
  var limitsEl;
  var guidePanel;
  var guideBtn;
  var inputZone;
  var upsellTitle;
  var upsellBody;
  var lastWords = [];
  var cloudGen = 0;

  function $(id) {
    return document.getElementById(id);
  }

  function t(ko, en) {
    return isKo ? ko : en;
  }

  function setStatus(msg) {
    if (statusEl) statusEl.textContent = msg || '';
  }

  function fmt(n) {
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function updateLimits() {
    if (!limitsEl) return;
    limitsEl.textContent = t(
      '최대 ' +
        fmt(MAX_CHARS) +
        '자 · 상위 ' +
        fmt(MAX_WORDS) +
        '개 단어 · 텍스트를 복사한 뒤 Ctrl+V 하세요',
      'Up to ' +
        fmt(MAX_CHARS) +
        ' chars · top ' +
        fmt(MAX_WORDS) +
        ' words · copy your text, then press Ctrl+V',
    );
  }

  function resizeCanvas() {
    var wrap = canvas.parentElement;
    var w = Math.min(640, (wrap && wrap.clientWidth) || 640);
    if (!w) w = 640;
    var h = Math.round(w * 0.62);
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
  }

  function tokenize(text) {
    var cleaned = String(text || '')
      .replace(/[\u200B-\u200D\uFEFF]/g, '')
      .replace(/[0-9]+/g, ' ')
      .replace(/[^\w\s\u3131-\u318E\uAC00-\uD7A3]/g, ' ')
      .toLowerCase();
    var parts = cleaned.split(/\s+/);
    var freq = Object.create(null);
    var i;
    var w;
    for (i = 0; i < parts.length; i++) {
      w = parts[i];
      if (w.length < MIN_LEN || STOP[w]) continue;
      freq[w] = (freq[w] || 0) + 1;
    }
    var ranked = Object.keys(freq)
      .map(function (k) {
        return [k, freq[k]];
      })
      .sort(function (a, b) {
        return b[1] - a[1];
      });
    return {
      list: ranked.slice(0, MAX_WORDS),
      total: ranked.length,
    };
  }

  function clearCanvas() {
    resizeCanvas();
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#161616';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  /** 직사각형 캔버스 네 변까지 단어가 닿도록 wordcloud2 shape 보정 */
  function makeRectShape(w, h, gridSize) {
    var ngx = Math.ceil(w / gridSize);
    var ngy = Math.ceil(h / gridSize);
    var halfW = ngx / 2;
    var halfH = ngy / 2;
    var maxR = Math.sqrt(ngx * ngx + ngy * ngy);
    return function rectShape(theta) {
      var cos = Math.abs(Math.cos(theta));
      var sin = Math.abs(Math.sin(theta));
      if (cos < 0.001) cos = 0.001;
      if (sin < 0.001) sin = 0.001;
      return Math.min(halfW / cos, halfH / sin) / maxR;
    };
  }

  function computeLayout(list) {
    var w = canvas.width;
    var h = canvas.height;
    var shortEdge = Math.min(w, h);
    var longEdge = Math.max(w, h);
    var area = w * h;
    var n = Math.max(list.length, 1);
    var maxCount = Math.max(list[0][1], 1);

    var avgLen = 0;
    var i;
    for (i = 0; i < list.length; i++) {
      avgLen += list[i][0].length;
    }
    avgLen = avgLen / n || 3;

    // 단어 적으면 크게, 많으면 촘촘히 — 네모 캔버스를 꽉 채움
    var countFill = Math.pow(38 / Math.max(n, 5), 0.34);
    countFill = Math.max(0.72, Math.min(1.9, countFill));
    var lenFill = Math.pow(3 / Math.max(avgLen, 2), 0.15);
    var areaFill = Math.sqrt(area / 250000);
    areaFill = Math.max(0.9, Math.min(1.15, areaFill));
    var wideFill = Math.pow(longEdge / shortEdge, 0.12);

    var basePx = shortEdge * 0.092 * countFill * lenFill * areaFill * wideFill;
    var minRatio = n > 120 ? 0.5 : 0.58;
    var maxRatio = 1.0;

    var pack = Math.pow(n / 42, 0.22);
    var grid = Math.round(shortEdge / (40 + n * 0.1) / pack);
    grid = Math.max(2, Math.min(9, grid));

    var minSize = n > 140 ? 5 : n > 80 ? 6 : 7;

    return {
      maxCount: maxCount,
      gridSize: grid,
      basePx: basePx,
      minRatio: minRatio,
      maxRatio: maxRatio,
      minSize: minSize,
      shape: makeRectShape(w, h, grid),
      origin: [w / 2, h / 2],
    };
  }

  function drawCloud(list) {
    if (!list.length) {
      clearCanvas();
      setStatus(t('분석할 단어가 없습니다. 더 긴 글을 붙여 넣어 보세요.', 'No words found. Paste longer text.'));
      return;
    }

    resizeCanvas();
    var layout = computeLayout(list);
    var maxCount = layout.maxCount;

    cloudGen += 1;
    var gen = cloudGen;

    if (typeof WordCloud.stop === 'function') {
      try {
        WordCloud.stop();
      } catch (stopErr) {
        /* ignore */
      }
    }

    function finishRender() {
      if (gen !== cloudGen) return;
      setStatus(
        t(
          list.length + '개 단어 표시 · 형태소 분석 없음',
          list.length + ' words · no morphological analysis',
        ),
      );
    }

    setTimeout(function () {
      if (gen !== cloudGen) return;
      var fallback = setTimeout(finishRender, 12000);
      canvas.addEventListener('wordcloudstop', function handler() {
        canvas.removeEventListener('wordcloudstop', handler);
        clearTimeout(fallback);
        if (gen !== cloudGen) return;
        finishRender();
      });

      WordCloud(canvas, {
        list: list,
        shape: layout.shape,
        gridSize: layout.gridSize,
        weightFactor: function (size) {
          var ratio = size / maxCount;
          return (
            layout.basePx *
            (layout.minRatio + (layout.maxRatio - layout.minRatio) * ratio)
          );
        },
        fontFamily: '"Noto Sans KR", system-ui, sans-serif',
        color: function () {
          return COLORS[Math.floor(Math.random() * COLORS.length)];
        },
        rotateRatio: 0.1,
        rotationSteps: 2,
        backgroundColor: '#161616',
        minSize: layout.minSize,
        ellipticity: 1,
        origin: layout.origin,
        drawOutOfBound: false,
        shrinkToFit: true,
        clearCanvas: true,
      });
    }, 30);
  }

  function generateFrom(text) {
    var raw = String(text || '').trim();
    if (!raw) {
      setStatus(t('글을 붙여넣거나 「옛이야기 예시」를 눌러 보세요.', 'Paste text or try the sample story.'));
      return;
    }
    if (raw.length > MAX_CHARS) raw = raw.slice(0, MAX_CHARS);
    if (textarea) textarea.value = raw;

    var result = tokenize(raw);
    lastWords = result.list;
    drawCloud(lastWords);
  }

  function setGuide(open) {
    if (!guidePanel || !guideBtn) return;
    if (open) {
      guidePanel.removeAttribute('hidden');
      if (inputZone) inputZone.classList.add('is-guide');
      guideBtn.setAttribute('aria-expanded', 'true');
      guideBtn.textContent = t('설명서 닫기', 'Hide guide');
    } else {
      guidePanel.setAttribute('hidden', '');
      if (inputZone) inputZone.classList.remove('is-guide');
      guideBtn.setAttribute('aria-expanded', 'false');
      guideBtn.textContent = t('설명서 보기', 'Show guide');
    }
  }

  function openModal(opts) {
    opts = opts || {};
    if (modal.showModal) modal.showModal();
    else modal.setAttribute('open', '');
    resizeCanvas();
    updateLimits();
    setGuide(!!opts.guide);
    if (!textarea || !textarea.value.trim()) {
      clearCanvas();
      setStatus(t('글을 붙여넣거나 「옛이야기 예시」를 눌러 보세요.', 'Paste text or try the sample story.'));
    } else {
      generateFrom(textarea.value);
    }
  }

  function closeDialog(el) {
    if (el && el.close) el.close();
  }

  function showUpsell(key) {
    var item = UPSELL[key];
    if (!item || !upsellModal) return;
    if (upsellTitle) upsellTitle.textContent = key.toUpperCase();
    if (upsellBody) upsellBody.textContent = isKo ? item.ko : item.en;
    if (upsellModal.showModal) upsellModal.showModal();
    else upsellModal.setAttribute('open', '');
  }

  function downloadPng() {
    try {
      var a = document.createElement('a');
      a.download = 'vibestat-wordcloud.png';
      a.href = canvas.toDataURL('image/png');
      a.click();
      setStatus(t('PNG를 저장했습니다.', 'PNG saved.'));
    } catch (e) {
      setStatus(t('이미지 저장에 실패했습니다.', 'Could not save image.'));
    }
  }

  function wire() {
    document.querySelectorAll('[data-wc-open]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        openModal({ guide: btn.hasAttribute('data-wc-open-guide') });
      });
    });

    document.querySelectorAll('[data-wc-upsell]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        showUpsell(btn.getAttribute('data-wc-upsell'));
      });
    });

    document.querySelectorAll('[data-wc-close]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-wc-close');
        closeDialog(id ? $(id) : modal);
      });
    });

    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeDialog(modal);
    });
    if (upsellModal) {
      upsellModal.addEventListener('click', function (e) {
        if (e.target === upsellModal) closeDialog(upsellModal);
      });
    }

    var genBtn = $('wc-btn-generate');
    var demoBtn = $('wc-btn-demo');
    var dlBtn = $('wc-btn-download');

    if (genBtn) {
      genBtn.addEventListener('click', function () {
        setGuide(false);
        generateFrom(textarea ? textarea.value : '');
      });
    }
    if (demoBtn) {
      demoBtn.addEventListener('click', function () {
        setGuide(false);
        if (textarea) textarea.value = SAMPLE;
        generateFrom(SAMPLE);
      });
    }
    if (dlBtn) dlBtn.addEventListener('click', downloadPng);
    if (guideBtn) {
      guideBtn.addEventListener('click', function () {
        setGuide(guidePanel.hasAttribute('hidden'));
      });
    }

    if (textarea) {
      textarea.addEventListener('paste', function (e) {
        e.preventDefault();
        setGuide(false);
        var clip = (e.clipboardData && e.clipboardData.getData('text/plain')) || '';
        if (textarea) textarea.value = clip;
        generateFrom(clip);
      });
    }

    window.addEventListener('resize', function () {
      if (modal.open && lastWords.length) drawCloud(lastWords);
    });
  }

  function boot() {
    if (booted) return true;
    if (typeof WordCloud !== 'function') return false;

    isKo = document.documentElement.lang === 'ko';
    modal = $('wc-modal');
    upsellModal = $('wc-upsell-modal');
    canvas = $('wc-canvas');
    textarea = $('wc-text-input');
    statusEl = $('wc-status');
    limitsEl = $('wc-text-limits');
    guidePanel = $('wc-guide-panel');
    guideBtn = $('wc-btn-guide');
    inputZone = $('wc-input-zone');
    upsellTitle = $('wc-upsell-title');
    upsellBody = $('wc-upsell-body');

    if (!modal || !canvas || !textarea) return false;

    booted = true;
    updateLimits();
    wire();
    return true;
  }

  function tryBoot() {
    if (boot()) return;
    var n = 0;
    var timer = setInterval(function () {
      n += 1;
      if (boot() || n > 40) {
        clearInterval(timer);
        if (!booted && statusEl) {
          statusEl.textContent = t(
            '워드클라우드 엔진 로드 실패 — Ctrl+F5로 새로고침해 주세요.',
            'Word cloud engine failed to load — press Ctrl+F5.',
          );
        }
      }
    }, 200);
  }

  if (document.readyState === 'complete') tryBoot();
  else window.addEventListener('load', tryBoot);
})();
