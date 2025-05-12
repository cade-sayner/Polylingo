# terraform backend
terraform {
  backend "s3" {
    bucket  = "polylingo-terraform-state"
    key     = "terraform.tfstate"
    region  = "af-south-1"
  }
}
