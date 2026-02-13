output "s3_bucket_name" {
  value = aws_s3_bucket.app_bucket.id
}

output "dynamodb_table_name" {
  value = aws_dynamodb_table.users_table.name
}

output "lambda_function_name" {
  value = aws_lambda_function.api_handler.function_name
}

output "api_url" {
  value = aws_api_gateway_rest_api.api.execution_arn
}
