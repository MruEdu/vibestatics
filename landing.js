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
    betaBtn.hidden = true;
    betaBtn.setAttribute('aria-hidden', 'true');
  }

  var licenseSubject = isKo
    ? 'VibeStat-Text 라이선스·유통 제휴 문의'
    : 'VibeStat-Text License & Distribution Inquiry';
  var licenseBody = isKo
    ? '안녕하세요. VibeStat-Text 라이선스·유통 제휴 문의를 드립니다.\n\n' +
      '이름·담당자:\n소속·기관 (출판사·총판·대학·연구소 등):\n연락처:\n회신 이메일:\n\n' +
      '문의 유형 (기관·볼륨·출판사·유통 파트너·수업 패키지 등):\n예상 사용자 수·기간:\n기타 요청 사항:\n'
    : 'Hello. I would like to inquire about VibeStat-Text licensing or distribution partnership.\n\n' +
      'Name / contact person:\nOrganization (publisher, distributor, university, institute):\nPhone:\nReply email:\n\n' +
      'Inquiry type (institution, volume, distribution partner, classroom):\nExpected users / duration:\nNotes:\n';

  ['btn-license-consult', 'btn-license-contact'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.href = mailto(licenseSubject, licenseBody);
  });
})();
