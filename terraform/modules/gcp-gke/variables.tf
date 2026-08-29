variable "environment" {
  type        = string
  description = "Environment name (dev, staging, prod)"
}

variable "region" {
  type        = string
  default     = "us-central1"
  description = "GCP Region for GKE"
}

variable "network_name" {
  type        = string
  description = "VPC network name"
}

variable "subnetwork_name" {
  type        = string
  description = "VPC subnetwork name"
}

variable "pods_ip_range_name" {
  type        = string
  default     = "gke-pods"
}

variable "services_ip_range_name" {
  type        = string
  default     = "gke-services"
}

variable "machine_type" {
  type        = string
  default     = "e2-standard-4"
  description = "GCP Compute Engine machine type for GKE nodes"
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
