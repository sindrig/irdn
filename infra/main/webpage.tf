locals {
  stage = "main"
  urls  = ["www.irdn.is", "irdn.is"]
}

data "aws_route53_zone" "zone" {
  name         = "irdn.is."
  private_zone = false
}

module "acm_irdn" {
  source  = "terraform-aws-modules/acm/aws"
  version = "5.0.0"

  domain_name       = "irdn.is"
  zone_id           = data.aws_route53_zone.zone.zone_id
  validation_method = "DNS"

  subject_alternative_names = [
    "*.irdn.is",
  ]

  wait_for_validation = true
  providers = {
    aws = aws.us
  }
}

module "webpage" {
  source  = "cloudposse/cloudfront-s3-cdn/aws"
  version = "0.92.0"

  namespace         = "irdn"
  stage             = local.stage
  name              = "webpage"
  aliases           = local.urls
  dns_alias_enabled = true
  parent_zone_name  = "irdn.is"

  acm_certificate_arn = module.acm_irdn.acm_certificate_arn
}
