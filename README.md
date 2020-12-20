# Path Finding Algorithm Visualizer

## Description

I created this project to gain more experience working with Javascript, HTML, and CSS, as well as building a CI/CD pipeline using Terraform, Ansible, and GitHub Actions. The servers used in the CI/CD pipeline were only used during development of this project and not for permanent hosting due to cost. Instead, I am using GitHub Pages to host the web page, which you can visit at [https://e-dang.github.io/Path-Finding-Algorithm-Visualizer](https://e-dang.github.io/Path-Finding-Algorithm-Visualizer/) (tested on FireFox).


## Algorithms

- Depth-First Search
- Breadth-First Search
- Greedy Best-First Search
- A* Search
- Bidirectional Search

## CI/CD
The CI/CD pipeline I built uses Terraform to provision staging and production servers on DigitalOcean, GitHub Actions to run my test suites on pull requests and pushes to the master branch, and Ansible for deployment. In order to get the pipeline working follow these steps:

- Create a .tfvars file in the terraform directory that contains values for the following:
  - do_token -> your DigitalOcean personal access token
  - my_domain -> the domain name of your servers
  - my_ssh_key_name -> the name of the ssh key that you will use to access your servers
- Add your ssh key to GitHub Secrets as environment variable SSH_KEY_DO.
- Add your staging server domain name to GitHub Secrets as environment variables STAGING_DOMAIN.
- Update the __inventory.ansible__ file in the __ansible__ directory with your server's domain names or ip addresses.
- Run the following commands to provision the servers: ```make provision-resources``` and ```make provision-software```


