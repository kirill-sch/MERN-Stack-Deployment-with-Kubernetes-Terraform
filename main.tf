terraform {
  required_providers {
    aws = {
        source = "hashicorp/aws"
        version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "eu-central-1"
}

resource "aws_vpc" "eks-vpc" {
  cidr_block = "10.0.0.0/16"
  instance_tenancy = "default"
  enable_dns_hostnames = true
  enable_dns_support = true

  tags = {
    Name = "kirill-eks-vpc"
  }
}

resource "aws_subnet" "public-subnet-1" {
  vpc_id = aws_vpc.eks-vpc.id
  cidr_block = "10.0.1.0/24"
  availability_zone = "eu-central-1a"

  tags = {
    Name = "kirill-eks-sb-public-1"
    "kubernetes.io/cluster/my-cluster" = "shared"
    "kubernetes.io/role/elb" = "1"
  }
}

resource "aws_subnet" "public-subnet-2" {
  vpc_id = aws_vpc.eks-vpc.id
  cidr_block = "10.0.2.0/24"
  availability_zone = "eu-central-1b"

  tags = {
    Name = "kirill-eks-sb-public-2"
    "kubernetes.io/cluster/my-cluster" = "shared"
    "kubernetes.io/role/elb" = "1"
  }
}

resource "aws_subnet" "private-subnet-1" {
  vpc_id = aws_vpc.eks-vpc.id
  cidr_block = "10.0.3.0/24"
  availability_zone = "eu-central-1a"

  tags = {
    Name = "kirill-eks-sb-private-1"
    "kubernetes.io/cluster/my-cluster" = "shared"
    "kubernetes.io/role/internal-elb" = "1"
  }
}

resource "aws_subnet" "private-subnet-2" {
  vpc_id = aws_vpc.eks-vpc.id
  cidr_block = "10.0.4.0/24"
  availability_zone = "eu-central-1b"

  tags = {
    Name = "kirill-eks-sb-private-2"
    "kubernetes.io/cluster/my-cluster" = "shared"
    "kubernetes.io/role/internal-elb" = "1"
  }
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.eks-vpc.id
  
  tags = {
    Name = "kirill-eks-igw"
  }
}

resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.eks-vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name = "kirill-eks-public-rt"
  }
}

resource "aws_route_table_association" "public_association-1" {
  subnet_id = aws_subnet.public-subnet-1.id
  route_table_id = aws_route_table.public_rt.id
}

resource "aws_route_table_association" "public_association-2" {
  subnet_id = aws_subnet.public-subnet-2.id
  route_table_id = aws_route_table.public_rt.id
}

/*resource "aws_eks_cluster" "eks_cluster" {
  name = "kirill-eks"

}*/

resource "aws_security_group" "sg_ec2" {
  name = "kirill-ec2-sg"
  vpc_id = aws_vpc.eks-vpc.id
  
  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port = 22
    to_port = 22
    protocol = "tcp"
    cidr_blocks = ["86.101.127.195/32"]
  }
}

resource "aws_instance" "ec2" {
  ami = "ami-0b74f796d330ab49c"
  instance_type = "t2.micro"
  key_name = "kirill-key-linux"
  security_groups = [aws_security_group.sg_ec2.id]
  subnet_id = aws_subnet.public-subnet-1.id

  tags = {
    Name = "kirill-ec2"
  }
}

resource "aws_eip" "eip" {
  instance = aws_instance.ec2.id
  domain = "vpc"
}