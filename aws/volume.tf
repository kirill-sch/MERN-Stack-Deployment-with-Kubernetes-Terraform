resource "aws_ebs_volume" "ebs-volume" {
  availability_zone = "eu-central-1a"
  size = 20
}