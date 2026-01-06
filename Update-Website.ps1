param(
  [string]$Message = "Update website"
)

git pull --rebase origin main
git add .
git commit -m $Message
git push
