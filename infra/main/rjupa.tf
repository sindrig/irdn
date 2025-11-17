resource "aws_route53_record" "rjupa" {
  zone_id = data.aws_route53_zone.zone.zone_id
  name    = "rjupa"
  type    = "CNAME"
  ttl     = 60
  records = ["74b3a2d52e776160.vercel-dns-017.com."]
}
