# VibeStatics Landing

바이브스타틱스 **공개 랜딩 페이지** (`MruEdu/vibestatics`)

## 공개 URL

**https://mruedu.github.io/vibestatics/**

## 배포 방식 (시범판)

| 파일 | 설명 |
|------|------|
| **ZIP** | `VibeStat-Text-0.7.7-beta.2-win64.zip` — 압축 풀고 `VibeStat.exe` 실행 (공개 랜딩 유일 경로) |

Release: **https://github.com/MruEdu/vibestat-releases**

## Release 업로드 (개발자)

```powershell
cd c:\Workspace\VibeStat-Text
npm run pack:student
powershell -ExecutionPolicy Bypass -File scripts/upload-release-api.ps1
```

## 연락

hyc6999@gmail.com
