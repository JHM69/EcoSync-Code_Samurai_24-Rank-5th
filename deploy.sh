
cd cs_backend
docker build -t cs_backend .
docker stop cs_backend || true
docker rm cs_backend || true
docker run -d --name cs_backend -p 5000:5000 cs_backend 
docker system prune -a --volumes -f

cd ../cs_frontend
docker build -t cs_frontend .
docker stop cs_frontend || true
docker rm cs_frontend || true
docker run -d --name cs_frontend -p 3000:3000 cs_frontend 
docker system prune -a --volumes -f