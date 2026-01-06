param(
  [string]$Message = "Update website"
)

git add .
git commit -m $Message
git push
