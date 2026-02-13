variable "aws_region" {
  description = "Região da AWS para deploy dos recursos"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Nome do projeto para tag e nomenclatura"
  type        = string
  default     = "matematica-mais"
}

variable "environment" {
  description = "Ambiente de deploy (dev, staging, prod)"
  type        = string
  default     = "dev"
}
