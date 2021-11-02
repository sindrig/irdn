resource "aws_s3_bucket" "redirect_bucket" {
  bucket = "syndris.is"

  website {
    redirect_all_requests_to = "https://irdn.is"
  }
}

data "aws_route53_zone" "zone" {
  name         = "syndris.is."
  private_zone = false
}

resource "aws_route53_record" "this" {
  zone_id = data.aws_route53_zone.zone.zone_id
  name    = ""
  type    = "A"

  alias {
    name                   = aws_s3_bucket.redirect_bucket.website_domain
    zone_id                = aws_s3_bucket.redirect_bucket.hosted_zone_id
    evaluate_target_health = true
  }
}
