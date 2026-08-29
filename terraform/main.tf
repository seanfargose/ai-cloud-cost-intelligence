# ============================================================
# AI-Powered Cloud Cost Intelligence Platform — Terraform Root
# ============================================================
# Provisions AKS, Azure PostgreSQL, Azure Redis, ACR, and VNet.
# State stored in Azure Storage for team collaboration.
# ============================================================

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.90"
    }
  }

  # Remote state in Azure Storage — uncomment after creating the storage account
  # backend "azurerm" {
  #   resource_group_name  = "tfstate-rg"
  #   storage_account_name = "costplatformtfstate"
  #   container_name       = "tfstate"
  #   key                  = "cost-platform.tfstate"
  # }
}

provider "azurerm" {
  features {
    resource_group {
      prevent_deletion_if_contains_resources = false
    }
  }
}

# ============================================================
# Resource Group
# ============================================================

resource "azurerm_resource_group" "main" {
  name     = "rg-${var.project_name}-${var.environment}"
  location = var.location

  tags = local.common_tags
}

# ============================================================
# Locals
# ============================================================

locals {
  common_tags = {
    project     = var.project_name
    environment = var.environment
    managed_by  = "terraform"
  }
}

# ============================================================
# Module: Networking (VNet, Subnets, NSGs)
# ============================================================

module "networking" {
  source = "./modules/networking"

  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  project_name        = var.project_name
  environment         = var.environment
  vnet_address_space  = var.vnet_address_space
  tags                = local.common_tags
}

# ============================================================
# Module: Azure Container Registry
# ============================================================

module "acr" {
  source = "./modules/acr"

  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  project_name        = var.project_name
  environment         = var.environment
  sku                 = var.acr_sku
  tags                = local.common_tags
}

# ============================================================
# Module: Azure Kubernetes Service
# ============================================================

module "aks" {
  source = "./modules/aks"

  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  project_name        = var.project_name
  environment         = var.environment
  kubernetes_version  = var.kubernetes_version
  node_count          = var.aks_node_count
  node_min_count      = var.aks_node_min_count
  node_max_count      = var.aks_node_max_count
  node_vm_size        = var.aks_node_vm_size
  subnet_id           = module.networking.aks_subnet_id
  acr_id              = module.acr.acr_id
  tags                = local.common_tags
}

# ============================================================
# Module: Azure Database for PostgreSQL Flexible Server
# ============================================================

module "database" {
  source = "./modules/database"

  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  project_name        = var.project_name
  environment         = var.environment
  db_sku              = var.db_sku
  db_storage_mb       = var.db_storage_mb
  db_admin_login      = var.db_admin_login
  db_admin_password   = var.db_admin_password
  subnet_id           = module.networking.database_subnet_id
  private_dns_zone_id = module.networking.postgres_private_dns_zone_id
  tags                = local.common_tags
}

# ============================================================
# Module: Azure Cache for Redis
# ============================================================

module "redis" {
  source = "./modules/redis"

  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  project_name        = var.project_name
  environment         = var.environment
  redis_sku           = var.redis_sku
  redis_family        = var.redis_family
  redis_capacity      = var.redis_capacity
  subnet_id           = module.networking.redis_subnet_id
  tags                = local.common_tags
}
