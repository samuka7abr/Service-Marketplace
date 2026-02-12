# ==========================================
# DynamoDB Table - Marketplace
# ==========================================
resource "aws_dynamodb_table" "marketplace" {
  name           = "Marketplace"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "PK"
  range_key      = "SK"

  attribute {
    name = "PK"
    type = "S"
  }

  attribute {
    name = "SK"
    type = "S"
  }

  attribute {
    name = "GSI1PK"
    type = "S"
  }

  attribute {
    name = "GSI1SK"
    type = "S"
  }

  attribute {
    name = "GSI2PK"
    type = "S"
  }

  attribute {
    name = "GSI2SK"
    type = "S"
  }

  # GSI1 - Para buscar por relacionamentos (cliente, request, etc)
  global_secondary_index {
    name            = "GSI1"
    hash_key        = "GSI1PK"
    range_key       = "GSI1SK"
    projection_type = "ALL"
  }

  # GSI2 - Para buscar por outros relacionamentos (serviço, provider, etc)
  global_secondary_index {
    name            = "GSI2"
    hash_key        = "GSI2PK"
    range_key       = "GSI2SK"
    projection_type = "ALL"
  }

  tags = {
    Name        = "Marketplace"
    Environment = "development"
    Project     = "Service-Marketplace"
  }
}

# ==========================================
# S3 Bucket - Media Storage
# ==========================================
resource "aws_s3_bucket" "marketplace_media" {
  bucket = "marketplace-bucket"

  tags = {
    Name        = "Marketplace Media Bucket"
    Environment = "development"
    Project     = "Service-Marketplace"
  }
}

resource "aws_s3_bucket_versioning" "marketplace_media_versioning" {
  bucket = aws_s3_bucket.marketplace_media.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_cors_configuration" "marketplace_media_cors" {
  bucket = aws_s3_bucket.marketplace_media.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST", "DELETE", "HEAD"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

# ==========================================
# SNS Topic - Notifications
# ==========================================
resource "aws_sns_topic" "proposal_notifications" {
  name = "proposal-notifications"

  tags = {
    Name        = "Proposal Notifications"
    Environment = "development"
    Project     = "Service-Marketplace"
  }
}

resource "aws_sns_topic" "request_notifications" {
  name = "request-notifications"

  tags = {
    Name        = "Request Notifications"
    Environment = "development"
    Project     = "Service-Marketplace"
  }
}

resource "aws_sns_topic" "media_processing" {
  name = "media-processing"

  tags = {
    Name        = "Media Processing"
    Environment = "development"
    Project     = "Service-Marketplace"
  }
}

# ==========================================
# SES - Email Configuration
# ==========================================
resource "aws_ses_email_identity" "marketplace_sender" {
  email = "noreply@marketplace.local"
}

resource "aws_ses_email_identity" "admin_email" {
  email = "admin@marketplace.local"
}

# Template para notificação de nova proposta
resource "aws_ses_template" "new_proposal" {
  name    = "new-proposal-notification"
  subject = "Nova proposta recebida - {{serviceName}}"
  html    = <<-EOT
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
            .button { background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Nova Proposta Recebida!</h1>
            </div>
            <div class="content">
                <h2>Olá, {{clientName}}!</h2>
                <p>Você recebeu uma nova proposta para sua solicitação:</p>
                <ul>
                    <li><strong>Serviço:</strong> {{serviceName}}</li>
                    <li><strong>Valor:</strong> R$ {{proposalAmount}}</li>
                    <li><strong>Prazo:</strong> {{deliveryTime}} dias</li>
                    <li><strong>Prestador:</strong> {{providerName}}</li>
                </ul>
                <p>{{proposalDescription}}</p>
                <a href="{{viewProposalUrl}}" class="button">Ver Proposta</a>
            </div>
            <div class="footer">
                <p>Service Marketplace - Conectando clientes e prestadores</p>
            </div>
        </div>
    </body>
    </html>
  EOT
  text    = "Você recebeu uma nova proposta de R$ {{proposalAmount}} com prazo de {{deliveryTime}} dias."
}

# Template para confirmação de solicitação
resource "aws_ses_template" "request_confirmation" {
  name    = "request-confirmation"
  subject = "Solicitação criada - {{requestTitle}}"
  html    = <<-EOT
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2196F3; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Solicitação Criada!</h1>
            </div>
            <div class="content">
                <h2>Olá, {{clientName}}!</h2>
                <p>Sua solicitação foi criada com sucesso:</p>
                <ul>
                    <li><strong>Título:</strong> {{requestTitle}}</li>
                    <li><strong>Orçamento:</strong> R$ {{requestBudget}}</li>
                    <li><strong>Localização:</strong> {{requestLocation}}</li>
                </ul>
                <p>Em breve prestadores começarão a enviar propostas.</p>
            </div>
            <div class="footer">
                <p>Service Marketplace</p>
            </div>
        </div>
    </body>
    </html>
  EOT
  text    = "Sua solicitação '{{requestTitle}}' foi criada com sucesso."
}

# ==========================================
# Outputs
# ==========================================
output "dynamodb_table_name" {
  description = "Nome da tabela DynamoDB"
  value       = aws_dynamodb_table.marketplace.name
}

output "s3_bucket_name" {
  description = "Nome do bucket S3"
  value       = aws_s3_bucket.marketplace_media.id
}

output "sns_proposal_topic_arn" {
  description = "ARN do tópico SNS de propostas"
  value       = aws_sns_topic.proposal_notifications.arn
}

output "sns_request_topic_arn" {
  description = "ARN do tópico SNS de solicitações"
  value       = aws_sns_topic.request_notifications.arn
}

output "sns_media_topic_arn" {
  description = "ARN do tópico SNS de processamento de mídia"
  value       = aws_sns_topic.media_processing.arn
}

output "ses_sender_email" {
  description = "Email remetente verificado no SES"
  value       = aws_ses_email_identity.marketplace_sender.email
}
