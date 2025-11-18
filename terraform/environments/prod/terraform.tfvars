aws_region  = "ap-northeast-1"
environment = "prod"

vpc_cidr = "10.1.0.0/16"

db_instance_class = "db.t3.small"
db_name           = "dogcafemap"
# db_username and db_password should be provided via environment variables or secure method

ecs_desired_count = 2
ecs_cpu           = "512"
ecs_memory        = "1024"

# nextauth_url and nextauth_secret should be provided via environment variables
# certificate_arn should be set for HTTPS
