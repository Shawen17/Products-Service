# Stage 1: Build the React app
FROM node:18-alpine AS build-stage

WORKDIR /react

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

CMD ["yarn", "start"]

# Stage 2: Serve with Nginx
# FROM nginx:alpine

# COPY --from=build-stage /react/build /usr/share/nginx/html

# # Copy your Nginx configuration
# COPY ./default.conf /etc/nginx/conf.d/default.conf

# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]
