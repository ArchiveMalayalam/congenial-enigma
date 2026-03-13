FROM ruby:3.3-slim

# Install build tools and dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    nodejs \
    && rm -rf /var/lib/apt/lists/*

# Install Jekyll and Bundler
RUN gem install jekyll bundler

# Set working directory
WORKDIR /workspace
