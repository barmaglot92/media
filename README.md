docker buildx build --platform linux/amd64 -t barmaglot92/media-frontend:latest --push -f ./Dockerfile-frontend .
docker buildx build --platform linux/amd64 -t barmaglot92/media-backend:latest --push -f ./Dockerfile-backend .