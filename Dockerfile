from node:12.2

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

EXPOSE 3000

ENV PREDICTION_SERVICE_URL 'http://jhenrycode-vision-1387687315.us-east-1.elb.amazonaws.com:9001/prediction/plant_maturity',
ENV ES_CLUSTER_URL 'https://search-jhenrycode-vision-elastic-noq6b4xyrmqyr3icukxyewyioa.us-east-1.es.amazonaws.com'

CMD ["npm", "run", "start"]