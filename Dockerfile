FROM node:latest

# See: https://askubuntu.com/questions/165676/how-do-i-fix-a-e-the-method-driver-usr-lib-apt-methods-http-could-not-be-foun#211531
RUN apt-get update \
    && apt-get install --assume-yes --no-install-recommends apt-transport-https \
    && curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
    && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
    && apt-get update \
    && apt-get install --assume-yes --no-install-recommends yarn \
    && mkdir /srv/app
ADD . /srv/app
WORKDIR /srv/app
RUN yarn install --production
CMD ["node", "lib/index.js"]
