variable "cluster_name" {
  description = "The EKS cluster's name"
  type        = string
  default     = "freestyle-mern-project"
}

variable "region" {
  type    = string
  default = "eu-central-1"
}

variable "project_name" {
  type    = string
  default = "mern-stack-deployment"
}