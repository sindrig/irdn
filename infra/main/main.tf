terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "eu-west-1"
}

provider "aws" {
  region = "us-east-1"
  alias  = "us"
}


terraform {
  backend "s3" {
    encrypt = true
    bucket  = "irdnis-tf-state"
    region  = "eu-west-1"
    key     = "main/terraform.tfstate"
  }
}
