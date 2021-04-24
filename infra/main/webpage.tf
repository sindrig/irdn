locals {
  stage = "main"
  urls  = ["www.irdn.is", "irdn.is"]
}

data "aws_acm_certificate" "irdn" {
  provider    = aws.us
  domain      = "irdn.is"
  types       = ["AMAZON_ISSUED"]
  most_recent = true
}

module "webpage" {
  source  = "cloudposse/cloudfront-s3-cdn/aws"
  version = "0.60.0"

  namespace         = "irdn"
  stage             = local.stage
  name              = "webpage"
  aliases           = local.urls
  dns_alias_enabled = true
  parent_zone_name  = "irdn.is"

  acm_certificate_arn = data.aws_acm_certificate.irdn.arn
}
