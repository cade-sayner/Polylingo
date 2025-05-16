output "ec2_endpoint" {
  value = aws_instance.polylingo_instance.public_dns
  description = "Public DNS of the EC2 instance (not necessary since we use ALB)"
}

output "db_endpoint" {
  value = aws_db_instance.polylingo_db_instance.endpoint
}

output "alb_dns_name" {
  value = aws_lb.polylingo_alb.dns_name
  description = "The DNS name of the Application Load Balancer"
}

