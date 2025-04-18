#!/bin/bash

set -e
set -u
set -o pipefail

REGION=$(cd aws && terraform output -raw region)
CLUSTER_NAME=$(cd aws && terraform output -raw cluster_name)
NAMESPACE_INGRESS="ingress-nginx"
NAMESPACE="default"
FOLDER_NAMES=("ingress" "secret" "configMap" "deployments")

aws eks update-kubeconfig --region $REGION --name $CLUSTER_NAME
kubectl get namespace "$NAMESPACE_INGRESS" || kubectl create namespace "$NAMESPACE_INGRESS"

echo "Applying manifests..."

apply_deployments_from_folders () {
    FOLDER="$1"

    echo "Applying folder: $FOLDER"
    kubectl apply -f kubernetes/"$FOLDER"
    sleep 5


    if [ "$FOLDER" == "deployments" ]; then

        echo "Waiting for deployments to be ready..."
        DEPLOYMENTS=$(kubectl get deployments -n "$NAMESPACE" -o name)

        for deploy in $DEPLOYMENTS; do
            echo "Checking rollout status for $deploy..."
            kubectl rollout status "$deploy" -n "$NAMESPACE" --timeout=150s
        done

        echo "✅ All deployments successfully rolled out in folder: $FOLDER"
    else 
        echo "✅ Manifests applied in folder: $FOLDER"
    fi
}

check_for_services () {
    echo "Checking if services exist..."
    SERVICES=$(kubectl get services -n $NAMESPACE -o name)

    if [ -z "$SERVICES" ]; then
        echo "❌ No services found!"
        exit 1
    else
        echo "✅ Services found: "
        echo "$SERVICES"
    fi
}

for str in ${FOLDER_NAMES[@]}; do
    apply_deployments_from_folders "$str"    
done

check_for_services

echo "🚀 Deployment script completed successfully."