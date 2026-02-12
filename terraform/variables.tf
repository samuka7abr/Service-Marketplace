variable "aws_region" {
  description = "Região AWS"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Ambiente (dev, staging, prod)"
  type        = string
  default     = "development"
}

variable "project_name" {
  description = "Nome do projeto"
  type        = string
  default     = "service-marketplace"
}

variable "dynamodb_table_name" {
  description = "Nome da tabela DynamoDB"
  type        = string
  default     = "Marketplace"
}

variable "s3_bucket_name" {
  description = "Nome do bucket S3"
  type        = string
  default     = "marketplace-bucket"
}

variable "ses_sender_email" {
  description = "Email remetente para SES"
  type        = string
  default     = "noreply@marketplace.local"
}

variable "ses_admin_email" {
  description = "Email do administrador"
  type        = string
  default     = "admin@marketplace.local"
}
