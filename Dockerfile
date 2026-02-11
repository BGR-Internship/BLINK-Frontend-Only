# --- Stage 1: Build the React App ---
FROM node:18-alpine as build

WORKDIR /app

# Copy package files first to cache dependencies
COPY package*.json ./
RUN npm install

# Copy all source code
COPY . .

# Build the app (Creates the 'dist' folder)
RUN npm run build

# --- Stage 2: Serve with Nginx ---
FROM nginx:alpine

# Copy the built files from the previous stage into Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copy our custom config (we will create this next)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 (standard web traffic)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]