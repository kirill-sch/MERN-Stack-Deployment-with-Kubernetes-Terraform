terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }   
  }
  /*backend "s3" {
    bucket = "mern-stack-deployment-tf-state"
    key = "state/terraform.tfstate"
    region = "eu-central-1"
    encrypt = true
    dynamodb_table = "terraform-state-lock-table"
  }*/
}

provider "aws" {
  region = var.region
}

data "aws_eks_cluster" "eks" {
  name = var.cluster_name

  depends_on = [
    aws_eks_cluster.eks-cluster
  ]
}

data "aws_eks_cluster_auth" "eks" {
  name = data.aws_eks_cluster.eks.name

  depends_on = [
    aws_eks_cluster.eks-cluster
  ]
}