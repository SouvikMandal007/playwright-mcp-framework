# Use official Playwright image with pre-installed browsers
FROM mcr.microsoft.com/playwright:v1.40.0-jammy

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy project files
COPY . .

# Create directories for test results
RUN mkdir -p test-results playwright-report screenshots

# Set environment variables
ENV CI=true
ENV NODE_ENV=production

# Run tests by default
CMD ["npm", "test"]
