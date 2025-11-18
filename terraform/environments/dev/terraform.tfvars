aws_region  = "ap-northeast-1"
environment = "dev"

vpc_cidr = "10.0.0.0/16"

db_instance_class = "db.t3.micro"
db_name           = "dogcafemap"
# db_username and db_password should be provided via environment variables or secure method

ecs_desired_count = 1
ecs_cpu           = "256"
ecs_memory        = "512"

# nextauth_url and nextauth_secret should be provided via environment variables
