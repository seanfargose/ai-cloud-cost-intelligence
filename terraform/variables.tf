# ============================================================
# Variables
# ============================================================

variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
  default     = "cost-platform"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "dev"

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}

variable "location" {
  description = "Azure region for all resources"
  type        = string
  default     = "eastus"
}

# --- Networking ---

variable "vnet_address_space" {
  description = "VNet CIDR address space"
  type        = list(string)
  default     = ["10.0.0.0/16"]
}

# --- AKS ---

variable "kubernetes_version" {
  description = "Kubernetes version for AKS"
  type        = string
  default     = "1.29"
}

variable "aks_node_count" {
  description = "Initial number of AKS nodes"
  type        = number
  default     = 2
}

variable "aks_node_min_count" {
  description = "Minimum nodes for AKS autoscaler"
  type        = number
  default     = 2
}

variable "aks_node_max_count" {
  description = "Maximum nodes for AKS autoscaler"
  type        = number
  default     = 10
}

variable "aks_node_vm_size" {
  description = "VM size for AKS node pool"
  type        = string
  default     = "Standard_D2s_v3"
}

# --- ACR ---

variable "acr_sku" {
  description = "ACR SKU tier"
  type        = string
  default     = "Basic"
}

# --- Database ---

variable "db_sku" {
  description = "PostgreSQL Flexible Server SKU"
  type        = string
  default     = "B_Standard_B1ms"
}

variable "db_storage_mb" {
  description = "PostgreSQL storage in MB"
  type        = number
  default     = 32768
}

variable "db_admin_login" {
  description = "PostgreSQL admin username"
  type        = string
  default     = "costplatformadmin"
}

variable "db_admin_password" {
  description = "PostgreSQL admin password"
  type        = string
  sensitive   = true
}

# --- Redis ---

variable "redis_sku" {
  description = "Redis SKU name (Basic, Standard, Premium)"
  type        = string
  default     = "Basic"
}

variable "redis_family" {
  description = "Redis SKU family (C for Basic/Standard, P for Premium)"
  type        = string
  default     = "C"
}

variable "redis_capacity" {
  description = "Redis cache capacity (0-6 for C family, 1-5 for P family)"
  type        = number
  default     = 0
}
