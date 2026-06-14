# Use the official Playwright image as base
FROM mcr.microsoft.com/playwright:v1.59.1-noble

# Set the working directory
WORKDIR /app

# Copy dependency configuration files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project code
COPY . .

# Default command to run tests
CMD ["npx", "playwright", "test"]
