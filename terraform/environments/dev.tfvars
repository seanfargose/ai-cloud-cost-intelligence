# ============================================================
# Development Environment — Small SKUs for Cost Savings
# ============================================================

project_name = "cost-platform"
environment  = "dev"
location     = "eastus"

# Networking
vnet_address_space = ["10.0.0.0/16"]

# AKS — minimal for dev
kubernetes_version = "1.29"
aks_node_count     = 2
aks_node_min_count = 1
aks_node_max_count = 3
aks_node_vm_size   = "Standard_B2s"

# ACR — Basic is fine for dev
acr_sku = "Basic"

# Database — smallest burstable SKU
db_sku         = "B_Standard_B1ms"
db_storage_mb  = 32768
db_admin_login = "costplatformadmin"
# db_admin_password = "..." # Pass via -var or TF_VAR_db_admin_password env var

# Redis — Basic C0 is the cheapest tier
redis_sku      = "Basic"
redis_family   = "C"
redis_capacity = 0
