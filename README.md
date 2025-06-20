
# Final Fantasy dating app

  Final Fantasy dating app using [MoogleApi](https://github.com/jackfperryjr/mog)

## How to install

  
```
- cd server

- npm install

- cd ..

- cd client

- npm install
```

  

- Copy *.env.local* to /server

## How to run

```
npm run dev
```
in /server and /client folders.

Open http://localhost:5173/ in your browser.


## Hot to setup cloud infrastructure

Provision with Terraform
```
terraform apply
```
Wait for Terraform to finish provisioning all resources.
Update the kubeconfig
```
aws eks update-kubeconfig --region eu-central-1 --name freestyle-mern-project
```
Deploy the NGINX Ingress Controller
```
cd ..
cd kubernetes/ingress
kubectl create namespace ingress-nginx
kubectl apply -f nginx-ingress.1.12.1.yaml
```
Retrieve the external IP address
```
kubectl get svc -n ingress-nginx
```
Copy the 'EXTERNAL-IP'.
It will look something like this: a2e885ad0eff74527bea23f46446c764-210310661.eu-central-1.elb.amazonaws.com

Configure your Ingress host
- Open 'ingress.yaml'.
- Paste the exterbal IP into the 'spec.rules.host' field.
```
kubectl apply -f ingress.yaml
```
Apply the remaining manifests

```
cd ..
# Apply configMaps, secrets, and deployments:
kubectl apply -f kubernetes/configMap
kubectl apply -f kubernetes/secret
# ...and so on.
```
Once your cluster and services are live, open your web browser and navigate to the external IP address you copied.