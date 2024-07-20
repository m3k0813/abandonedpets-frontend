# 가져올 이미지 정의
FROM node:20-alpine
# 경로 설정
WORKDIR /abandonedpets
# package.json 워킹 디렉토리 복사
COPY package.json ./
COPY yarn.lock ./
# 명령어 실행 (의존성 설치)
RUN yarn install
# 현재 디렉토리의 모든 파일을 도커 컨테이너 워킹 디렉토리에 복사
COPY . ./

# 빌드
RUN yarn build

# 포트 5173번 노출
EXPOSE 5173

CMD ["yarn", "dev"]