terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "1.22.2"
    }
  }
}

variable "do_token" {
  type = string
}

variable "my_domain" {
  type = string
}

variable "my_ssh_key_name" {
  type = string
}

provider "digitalocean" {
  token = var.do_token
}

# get ssh key
data "digitalocean_ssh_key" "default" {
  name = var.my_ssh_key_name
}

# allocate staging server
resource "digitalocean_droplet" "staging-server" {
  image    = "ubuntu-18-04-x64"
  name     = "staging"
  region   = "sfo2"
  size     = "s-1vcpu-1gb"
  ssh_keys = [data.digitalocean_ssh_key.default.fingerprint]
}

# allocate production server
resource "digitalocean_droplet" "prod-server" {
  image    = "ubuntu-18-04-x64"
  name     = "prod"
  region   = "sfo2"
  size     = "s-1vcpu-1gb"
  ssh_keys = [data.digitalocean_ssh_key.default.fingerprint]
}

# specify domain name
data "digitalocean_domain" "default" {
  name = var.my_domain
}

# create staging record
resource "digitalocean_record" "A-staging" {
  domain = data.digitalocean_domain.default.name
  type   = "A"
  name   = "staging"
  value  = digitalocean_droplet.staging-server.ipv4_address
}

# create production record
resource "digitalocean_record" "A-prod" {
  domain = data.digitalocean_domain.default.name
  type   = "A"
  name   = "prod"
  value  = digitalocean_droplet.prod-server.ipv4_address
}
