#!/bin/bash

# Dog Cafe Map Deployment Script

set -e

ENVIRONMENT=${1:-dev}
AWS_REGION=${AWS_REGION:-ap-northeast-1}
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

echo "====================================="
echo "Dog Cafe Map Deployment"
echo "Environment: $ENVIRONMENT"
echo "Region: $AWS_REGION"
echo "====================================="

# Get ECR repository URL from Terraform output
cd terraform
ECR_REPO=$(terraform output -raw ecr_repository_url)
CLUSTER_NAME=$(terraform output -raw ecs_cluster_name)
SERVICE_NAME=$(terraform output -raw ecs_service_name)
cd ..

echo "ECR Repository: $ECR_REPO"
echo "ECS Cluster: $CLUSTER_NAME"
echo "ECS Service: $SERVICE_NAME"

# Build Docker image
echo "Building Docker image..."
docker build -t dog-cafe-map:latest .

# Tag image
echo "Tagging image..."
docker tag dog-cafe-map:latest $ECR_REPO:latest
docker tag dog-cafe-map:latest $ECR_REPO:$(git rev-parse --short HEAD)

# Login to ECR
echo "Logging in to ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REPO

# Push image
echo "Pushing image to ECR..."
docker push $ECR_REPO:latest
docker push $ECR_REPO:$(git rev-parse --short HEAD)

# Run database migrations
echo "Running database migrations..."
# Note: This should be done securely, possibly via ECS task
# export DATABASE_URL=$(aws secretsmanager get-secret-value --secret-id dog-cafe-map-$ENVIRONMENT-database-url --query SecretString --output text --region $AWS_REGION)
# npx prisma migrate deploy

# Update ECS service
echo "Updating ECS service..."
aws ecs update-service \
  --cluster $CLUSTER_NAME \
  --service $SERVICE_NAME \
  --force-new-deployment \
  --region $AWS_REGION

echo "====================================="
echo "Deployment initiated successfully!"
echo "====================================="
echo "Monitor deployment status:"
echo "aws ecs describe-services --cluster $CLUSTER_NAME --services $SERVICE_NAME --region $AWS_REGION"
