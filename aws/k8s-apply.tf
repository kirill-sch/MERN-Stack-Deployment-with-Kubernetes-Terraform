data "kubectl_filename_list" "configs" {
    pattern = "./../kubernetes/config/*.yaml"
}

resource "kubectl_manifest" "configs-apply" {
    count = length(data.kubectl_filename_list.configs.matches)
    yaml_body = file(element(data.kubectl_filename_list.configs.matches, count.index))

    depends_on = [ 
        aws_eks_cluster.eks-cluster,
    aws_eks_node_group.nodes
     ]
}

data "kubectl_filename_list" "secrets" {
    pattern = "./../kubernetes/secret/*.yaml"
}

resource "kubectl_manifest" "secrets-apply" {
    count = length(data.kubectl_filename_list.secrets.matches)
    yaml_body = file(element(data.kubectl_filename_list.secrets.matches, count.index))

    depends_on = [ 
        aws_eks_cluster.eks-cluster,
    aws_eks_node_group.nodes
     ]
}

data "kubectl_filename_list" "deployments" {
    pattern = "./../kubernetes/*.yaml"
}

resource "kubectl_manifest" "deployments-apply" {
  count = length(data.kubectl_filename_list.deployments.matches)
  yaml_body = file(element(data.kubectl_filename_list.deployments.matches, count.index))

  depends_on = [ 
    aws_eks_cluster.eks-cluster,
    aws_eks_node_group.nodes,
    kubectl_manifest.configs-apply,
    kubectl_manifest.secrets-apply
   ]
}