variable "relay_email" {
  default     = "sindri@irdn.is"
  description = "Email that used to relay from"
}

variable "forward_emails" {
  type = map(list(string))

  default = {
    "sindri@irdn.is"             = ["sindrigudmundsson@gmail.com"]
    "sharding-solutions@irdn.is" = ["sindrigudmundsson@gmail.com"]
  }
  description = "Emails forward map"
}

module "ses_lambda_forwarder" {
  source = "cloudposse/ses-lambda-forwarder/aws"
  # Cloud Posse recommends pinning every module to a specific version
  version = "0.10.0"

  namespace = "irdn"
  stage     = "prod"
  name      = "email-forward"

  region = "eu-west-1"
  domain = "irdn.is"

  relay_email    = var.relay_email
  forward_emails = var.forward_emails
}
