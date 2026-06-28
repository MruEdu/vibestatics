# VibeStatics Landing

바이브스타틱스 **공개 랜딩 페이지** (`MruEdu/vibestatics`)

## 공개 URL

| URL | 용도 |
|-----|------|
| **https://vibestatics.com** | 메인 (커스텀 도메인) |
| https://mruedu.github.io/vibestatics/ | GitHub Pages 기본 주소 |
| https://vibestatics.kr · https://vibestatics.co.kr | → `.com` 리다이렉트 (가비아 포워딩) |

## 배포 방식

| 대상 | 파일 | 공개 |
|------|------|------|
| **일반·랜딩** | `VibeStat-Text-*-win64.zip` | ✅ GitHub Release · vibestatics.com |
| **실습반·정식 (이메일)** | `VibeStat-Setup-*-email.zip` | ❌ 메일 첨부만 |

공개 Release: **https://github.com/MruEdu/vibestat-releases**

### 공개 ZIP (학생·시범판)

```powershell
cd c:\Workspace\VibeStat-Text
npm run pack:student
powershell -ExecutionPolicy Bypass -File scripts/upload-release-api.ps1
```

### Setup.zip (실습반·정식 — 이메일만)

```powershell
npm run pack:setup-email              # 시범 Setup
npm run pack:setup-email -- --formal  # 정식·기한 Setup
# → releases\VibeStat-Setup-*-email.zip  ※ GitHub 공개 업로드 금지
```

메일 문구: `VibeStatics-landing/scripts/workshop-setup-email.txt`

## 연락

hyc6999@gmail.com
