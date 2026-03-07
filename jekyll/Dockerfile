# Stage 1: Build
FROM ruby:3.3-slim as builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy Gemfile and lock file
COPY Gemfile* ./

# Install gems
# note: running without --deployment avoids requiring a Gemfile.lock during build
# you can still commit a Gemfile.lock for reproducible installs later
RUN bundle install

# Copy source code
COPY . .

# Build Jekyll site
RUN bundle exec jekyll build

# Stage 2: Runtime
FROM nginx:alpine

# Copy built site to nginx
COPY --from=builder /app/_site /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
