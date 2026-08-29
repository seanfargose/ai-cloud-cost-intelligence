#!/bin/bash

# AI Cost Optimization Platform Setup Script
# This script sets up the complete development environment

set -e

echo "🚀 Setting up AI Cost Optimization Platform..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ and try again."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node -v)"
        exit 1
    fi
    
    print_success "Node.js $(node -v) is installed"
}

# Check if Docker is available (optional)
check_docker() {
    if command -v docker &> /dev/null; then
        print_success "Docker is available"
        DOCKER_AVAILABLE=true
    else
        print_warning "Docker is not available. You'll need to install PostgreSQL and Redis manually."
        DOCKER_AVAILABLE=false
    fi
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    npm install
    print_success "Dependencies installed"
}

# Setup environment file
setup_environment() {
    print_status "Setting up environment configuration..."
    
    if [ ! -f .env ]; then
        cp .env.example .env
        print_success "Created .env file from .env.example"
        print_warning "Please edit .env file with your configuration before running the application"
    else
        print_warning ".env file already exists, skipping creation"
    fi
}

# Setup databases with Docker
setup_databases_docker() {
    if [ "$DOCKER_AVAILABLE" = true ]; then
        if ! docker compose version >/dev/null 2>&1; then
            print_warning "Docker Compose is not available. Install Docker Desktop/Compose or configure PostgreSQL and Redis manually."
            return
        fi

        print_status "Starting PostgreSQL and Redis with Docker Compose..."
        docker compose up -d

        print_status "Waiting for services to become healthy..."
        for i in {1..30}; do
            POSTGRES_OK=false
            REDIS_OK=false
            docker compose exec -T postgres pg_isready -U postgres >/dev/null 2>&1 && POSTGRES_OK=true
            docker compose exec -T redis redis-cli ping >/dev/null 2>&1 && REDIS_OK=true
            if [ "$POSTGRES_OK" = true ] && [ "$REDIS_OK" = true ]; then
                print_success "PostgreSQL and Redis are ready"
                return
            fi
            sleep 1
        done

        print_warning "Docker services started but did not both become ready within 30 seconds. Check: docker compose ps"
    fi
}

# Build all workspaces
build_workspaces() {
    print_status "Building all workspaces..."
    npm run build
    print_success "All workspaces built successfully"
}

# Display setup completion message
display_completion() {
    echo ""
    echo "🎉 Setup completed successfully!"
    echo ""
    echo "📋 Next steps:"
    echo ""
    echo "1. Edit the .env file with your configuration:"
    echo "   - Add your Anthropic API key"
    echo "   - Configure Azure credentials (optional)"
    echo "   - Adjust database settings if needed"
    echo ""
    echo "2. Start the development environment:"
    echo "   ${GREEN}npm run dev:full${NC}     # Start both backend and frontend"
    echo "   ${GREEN}npm run dev:backend${NC}  # Start only backend"
    echo "   ${GREEN}npm run dev${NC}          # Start only frontend"
    echo ""
    echo "3. Access the application:"
    echo "   Frontend:  http://localhost:3000"
    echo "   Backend:   http://localhost:8000"
    echo "   Health:    http://localhost:8000/health"
    echo "   WebSocket: ws://localhost:8000"
    echo ""
    echo "4. Optional services:"
    echo "   ${GREEN}npm run mcp:azure${NC}    # Start Azure Cost MCP server"
    echo "   ${GREEN}npm run ai:dev${NC}       # Start AI Analysis Engine"
    echo ""
    echo "📚 Documentation:"
    echo "   - Main README: ./README.md"
    echo "   - Backend: ./backend/README.md"
    echo "   - Dashboard: ./dashboard/README.md"
    echo "   - AI Engine: ./ai-analysis-engine/README.md"
    echo ""
    
    if [ "$DOCKER_AVAILABLE" = true ]; then
        echo "🐳 Docker containers:"
        echo "   PostgreSQL: cost-opt-postgres (port 5432)"
        echo "   Redis:      cost-opt-redis (port 6379)"
        echo ""
        echo "   Stop containers: docker stop cost-opt-postgres cost-opt-redis"
        echo "   Remove containers: docker rm cost-opt-postgres cost-opt-redis"
        echo ""
    fi
    
    echo "🔧 Troubleshooting:"
    echo "   - Check logs: npm run dev:backend (in separate terminal)"
    echo "   - Verify databases: docker ps (if using Docker)"
    echo "   - Test API: curl http://localhost:8000/health"
    echo ""
}

# Main setup process
main() {
    echo "🔍 Checking prerequisites..."
    check_node
    check_docker
    
    echo ""
    echo "📦 Installing and configuring..."
    install_dependencies
    setup_environment
    
    if [ "$DOCKER_AVAILABLE" = true ]; then
        echo ""
        echo "🗄️ Setting up databases..."
        setup_databases_docker
    fi
    
    echo ""
    echo "🔨 Building project..."
    build_workspaces
    
    echo ""
    display_completion
}

# Handle script interruption
trap 'print_error "Setup interrupted"; exit 1' INT

# Run main function
main