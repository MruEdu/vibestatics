# VibeStatics-landing 최초 GitHub push
# 사전: GitHub에서 public 저장소 "VibeStatics-landing" 생성

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

if (-not (Test-Path .git)) {
  git init
  git branch -M main
}

git add index.html styles.css assets/logo.png README.md
git diff --cached --quiet
if ($LASTEXITCODE -eq 0) {
  Write-Host "[first-push] 커밋할 변경 없음"
} else {
  git commit -m "feat: VibeStatics public landing page"
}

$remote = git remote get-url origin 2>$null
if (-not $remote) {
  git remote add origin https://github.com/vibestatics/vibestatics.git
  Write-Host "[first-push] remote origin 추가됨"
}

git push -u origin main
Write-Host "[first-push] OK — Settings → Pages → main / root 설정하세요"
