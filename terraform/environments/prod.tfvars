# ============================================================
# Production Environment — HA, Performance, Security
# ============================================================

project_name = "cost-platform"
environment  = "prod"
location     = "eastus"

# Networking
vnet_address_space = ["10.0.0.0/16"]

# AKS — production-grade
kubernetes_version = "1.29"
aks_node_count     = 3
aks_node_min_count = 3
aks_node_max_count = 10
aks_node_vm_size   = "Standard_D4s_v3"

# ACR — Standard supports webhooks, geo-replication optional
acr_sku = "Standard"

# Database — General Purpose for consistent performance
db_sku         = "GP_Standard_D2s_v3"
db_storage_mb  = 65536
db_admin_login = "costplatformadmin"
# db_admin_password = "..." # Pass via -var or TF_VAR_db_admin_password env var

# Redis — Standard for replication and SLA
redis_sku      = "Standard"
redis_family   = "C"
redis_capacity = 1
