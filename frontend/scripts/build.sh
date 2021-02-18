
rm -rf ../backend/public/admin-frontend
cp -R build ../backend/public/admin-frontend
mkdir -p ../backend/resources/views/admin-frontend
mv ../backend/public/admin-frontend/index.html ../backend/resources/views/admin-frontend/index.html