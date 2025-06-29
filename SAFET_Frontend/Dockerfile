# filepath: /run/media/venom/D/Work/Safe_T/SAFET_Frontend/Dockerfile
# Use an official node image as the base image
FROM node:20.18.2-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the application
RUN npm run build

# Use an official nginx image to serve the built application
FROM nginx:alpine

# Copy the built application from the previous stage to the nginx html directory
COPY --from=0 /app/dist /usr/share/nginx/html

# Copy custom nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]