terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">5"
    }
  }
}

provider "aws" {
  region = "eu-west-1"

  skip_metadata_api_check     = true
  skip_region_validation      = true
  skip_credentials_validation = true
  skip_requesting_account_id  = true
  default_tags {
    tags = {
      state = "kidfood"
    }
  }
}



terraform {
  backend "s3" {
    encrypt = true
    bucket  = "irdnis-tf-state"
    region  = "eu-west-1"
    key     = "kidfood/terraform.tfstate"
  }
}
