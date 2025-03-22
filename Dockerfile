# Use the latest Node.js image based on Debian/Ubuntu
FROM node:23-bullseye
# Set working directory inside the container
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package.json and install dependencies
COPY package.json ./
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Expose the port (Render will use it)
EXPOSE 3000

# Command to start the app
CMD ["pnpm", "start"]
