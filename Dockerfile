FROM node:17.9.0
WORKDIR /sur_chat
COPY . .
RUN npm install 
RUN npm run build
EXPOSE 3000
CMD npm run start
