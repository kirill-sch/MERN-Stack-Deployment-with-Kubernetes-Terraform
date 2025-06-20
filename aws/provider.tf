terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }   
  }
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