variable "environment" {
  type        = string
  description = "Environment name (dev, staging, prod)"
}

variable "kubernetes_version" {
  type        = string
  default     = "1.29"
  description = "Kubernetes version for the EKS cluster"
}

variable "subnet_ids" {
  type        = list(string)
  description = "List of VPC subnet IDs where EKS cluster and node groups are placed"
}

variable "instance_types" {
  type        = list(string)
  default     = ["m6i.large", "c6i.large"]
  description = "EC2 instance types for EKS worker nodes"
}

variable "desired_node_count" {
  type        = number
  default     = 2
}

variable "min_node_count" {
  type        = number
  default     = 2
}

variable "max_node_count" {
  type        = number
  default     = 8
}

variable "tags" {
  type        = map(string)
  default     = {
    Project = "AI-Cloud-Cost-Intelligence"
    ManagedBy = "Terraform"
  }
}
