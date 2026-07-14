provider "aws" {
  region = "us-east-1"
}

resource "aws_instance" "smartcomply" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.medium"
  user_data     = file("install-docker.sh")
  tags = {
    Name = "Smartcomply-Server"
  }
}