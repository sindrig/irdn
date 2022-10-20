data "aws_ssm_parameter" "webhook-url" {
  name = "/irdn/kidfood/slack-webhook-url"
}
module "lambda_function" {
  source = "terraform-aws-modules/lambda/aws"

  function_name = "kidfood"
  description   = "Post what the kids are having for lunch to slack"
  handler       = "index.handler"
  runtime       = "python3.9"
  publish       = true

  source_path = "./src/"

  allowed_triggers = {
    KidFoodRule = {
      principal  = "events.amazonaws.com"
      source_arn = aws_cloudwatch_event_rule.schedule.arn
    }
  }
  environment_variables = {
    SLACK_WEBHOOK_URL = data.aws_ssm_parameter.webhook-url.value
  }
}

resource "aws_cloudwatch_event_rule" "schedule" {
  name                = "RunKidFood"
  description         = "Posts kid food today to slack"
  schedule_expression = "cron(15 8 * * ? *)"
}

resource "aws_cloudwatch_event_target" "scan_ami_lambda_function" {
  rule = aws_cloudwatch_event_rule.schedule.name
  arn  = module.lambda_function.lambda_function_arn
}
