# Step 1: Use a node image to build the React app
FROM node:18 AS build

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy the package.json and package-lock.json
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the source code into the container
COPY . .

# Step 6: Build the app for production
RUN npm run build

# Step 7: Use a lightweight server to serve the build files
FROM nginx:alpine

# Step 8: Copy the build folder from the previous step into the NGINX container
COPY --from=build /app/build /usr/share/nginx/html

# Step 9: Expose the default port for NGINX
EXPOSE 80

# Step 10: Start NGINX
CMD ["nginx", "-g", "daemon off;"]
