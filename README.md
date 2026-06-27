# VibeStatics Landing (Public)

바이브스타틱스 **공개 랜딩 페이지** 전용 저장소입니다.  
메인 소스(`vibestat`)는 private, 이 저장소만 **public** 으로 Pages에 올립니다.

## 공개 URL (Pages 설정 후)

| 저장소 이름 | URL |
|-------------|-----|
| `VibeStatics-landing` | https://mruedu.github.io/VibeStatics-landing/ |
| `MruEdu.github.io` 로 만들면 | https://mruedu.github.io/ (루트) |

## 최초 설정 (3단계)

### 1) GitHub에 public 저장소 만들기

1. https://github.com/new
2. Repository name: **`VibeStatics-landing`**
3. **Public** 선택 → Create repository

### 2) 이 폴더 push

```powershell
cd c:\Workspace\VibeStatics-landing
git init
git add .
git commit -m "feat: VibeStatics public landing page"
git branch -M main
git remote add origin https://github.com/MruEdu/VibeStatics-landing.git
git push -u origin main
```

### 3) GitHub Pages 켜기

1. 저장소 → **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **`main`** · **`/ (root)`** → Save

1~2분 후 https://mruedu.github.io/VibeStatics-landing/ 접속

---

## exe 다운로드 (별도 public 저장소)

private `vibestat` 의 Release는 **외부에서 받을 수 없습니다.**  
exe는 **`vibestat-releases`** public 저장소에 올립니다.

1. https://github.com/new → 이름 **`vibestat-releases`** · **Public**
2. 로컬에서:

```powershell
gh auth login
cd c:\Workspace\VibeStat-Text
powershell -ExecutionPolicy Bypass -File scripts/publish-beta-release.ps1 -ReleaseRepo MruEdu/vibestat-releases
```

(스크립트가 `-ReleaseRepo` 를 지원하도록 아래 VibeStat-Text 쪽도 갱신)

---

## 파일

- `index.html` — 랜딩 페이지
- `styles.css` — 스타일
- `assets/logo.png` — 로고

## 연락

hyc6999@gmail.com
