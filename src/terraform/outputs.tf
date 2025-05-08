output "ec2_endpoint" {
  value = aws_instance.polylingo_instance.public_dns
}

output "db_endpoint" {
  value = aws_db_instance.polylingo_db_instance.endpoint
}


