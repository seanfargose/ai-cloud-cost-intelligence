# ============================================================
# Outputs
# ============================================================

output "resource_group_name" {
  description = "Name of the resource group"
  value       = azurerm_resource_group.main.name
}

output "aks_cluster_name" {
  description = "AKS cluster name"
  value       = module.aks.cluster_name
}

output "aks_kube_config" {
  description = "AKS kubeconfig (sensitive)"
  value       = module.aks.kube_config_raw
  sensitive   = true
}

output "aks_get_credentials_command" {
  description = "Command to get AKS credentials"
  value       = "az aks get-credentials --resource-group ${azurerm_resource_group.main.name} --name ${module.aks.cluster_name}"
}

output "acr_login_server" {
  description = "ACR login server URL"
  value       = module.acr.login_server
}

output "acr_login_command" {
  description = "Command to login to ACR"
  value       = "az acr login --name ${module.acr.acr_name}"
}

output "database_host" {
  description = "PostgreSQL server FQDN"
  value       = module.database.fqdn
}

output "database_connection_string" {
  description = "PostgreSQL connection string (sensitive)"
  value       = "postgresql://${var.db_admin_login}:${var.db_admin_password}@${module.database.fqdn}:5432/cost_optimization?sslmode=require"
  sensitive   = true
}

output "redis_hostname" {
  description = "Redis cache hostname"
  value       = module.redis.hostname
}

output "redis_connection_string" {
  description = "Redis connection string (sensitive)"
  value       = module.redis.primary_connection_string
  sensitive   = true
}
