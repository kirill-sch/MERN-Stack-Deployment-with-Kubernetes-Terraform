output "cluster_name" {
  value = aws_eks_cluster.eks-cluster.name
}

output "security_group_name" {
  value = aws_security_group.eks-security-group.name
}

output "cluster_endpoint" {
  value = aws_eks_cluster.eks-cluster.endpoint
}

output "region" {
  value = var.region
}
