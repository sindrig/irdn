terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "3.36.0"
    }
  }
}

provider "aws" {
  region = "eu-west-1"
}

terraform {
  backend "s3" {
    encrypt = true
    bucket  = "irdnis-tf-state"
    region  = "eu-west-1"
    key     = "syndris/terraform.tfstate"
  }
}
