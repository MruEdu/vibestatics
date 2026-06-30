(function initLanding() {
  var TO = 'hyc6999@gmail.com';
  var isKo = document.documentElement.lang === 'ko';

  function mailto(subject, body) {
    return (
      'mailto:' +
      TO +
      '?subject=' +
      encodeURIComponent(subject) +
      '&body=' +
      encodeURIComponent(body)
    );
  }

  var betaBtn = document.getElementById('btn-beta-apply');
  if (betaBtn) {
    betaBtn.href = isKo
      ? mailto(
          'VibeStat-Text 시험판 신청',
          '안녕하세요. VibeStat-Text 시험판 신청합니다.\n\n' +
            '이름:\n소속 (대학·연구소·기관 등):\n전공·연구 분야:\n연락처:\n회신 이메일:\n\n' +
            '시험판 사용 목적 (연구·수업·기타):\n간단한 코멘트 (선택):\n',
        )
      : mailto(
          'VibeStat-Text Beta Trial Application',
          'Hello. I would like to apply for the VibeStat-Text beta trial.\n\n' +
            'Name:\nAffiliation (university, institute, organization):\nResearch field:\nPhone:\nReply email:\n\n' +
            'Intended use (research, teaching, other):\nComments (optional):\n',
        );
  }

  var licenseSubject = isKo ? 'VibeStat-Text 정식·라이센스 상담' : 'VibeStat-Text License Inquiry';
  var licenseBody = isKo
    ? '안녕하세요. VibeStat-Text 정식판·라이센스 상담을 요청합니다.\n\n' +
      '이름·담당자:\n소속·기관:\n연락처:\n회신 이메일:\n\n' +
      '문의 유형 (정식판 구매·기관·수업·볼륨 라이센스 등):\n예상 사용자 수·기간:\n기타 요청 사항:\n'
    : 'Hello. I would like to inquire about VibeStat-Text licensing.\n\n' +
      'Name / contact person:\nOrganization:\nPhone:\nReply email:\n\n' +
      'Inquiry type (formal license, institution, classroom, volume):\nExpected users / duration:\nNotes:\n';

  ['btn-license-consult', 'btn-license-contact'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.href = mailto(licenseSubject, licenseBody);
  });

  document.querySelectorAll('.video-thumb[data-youtube]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = btn.getAttribute('data-youtube');
      var title = btn.getAttribute('data-title') || 'VibeStat-Text demo';
      var teaser = btn.closest('.video-teaser');
      if (!id || !teaser) return;

      var wrap = teaser.querySelector('.video-wrap-compact');
      if (!wrap || wrap.dataset.loaded === '1') return;

      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube.com/embed/' + id + '?autoplay=1';
      iframe.title = title;
      iframe.allow =
        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      wrap.appendChild(iframe);
      wrap.hidden = false;
      wrap.dataset.loaded = '1';

      btn.hidden = true;
      var hint = teaser.querySelector('.video-thumb-hint');
      if (hint) hint.hidden = true;
    });
  });
})();
