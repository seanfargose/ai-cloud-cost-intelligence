# ============================================================
# Redis Module — Azure Cache for Redis
# ============================================================

variable "resource_group_name" { type = string }
variable "location" { type = string }
variable "project_name" { type = string }
variable "environment" { type = string }
variable "redis_sku" { type = string }
variable "redis_family" { type = string }
variable "redis_capacity" { type = number }
variable "subnet_id" { type = string }
variable "tags" { type = map(string) }

resource "azurerm_redis_cache" "main" {
  name                = "redis-${var.project_name}-${var.environment}"
  resource_group_name = var.resource_group_name
  location            = var.location
  capacity            = var.redis_capacity
  family              = var.redis_family
  sku_name            = var.redis_sku
  enable_non_ssl_port = false
  minimum_tls_version = "1.2"

  redis_configuration {
    maxmemory_policy = "allkeys-lru"
  }

  tags = var.tags
}

# ---- Outputs ----

output "redis_id" {
  value = azurerm_redis_cache.main.id
}

output "hostname" {
  value = azurerm_redis_cache.main.hostname
}

output "ssl_port" {
  value = azurerm_redis_cache.main.ssl_port
}

output "primary_access_key" {
  value     = azurerm_redis_cache.main.primary_access_key
  sensitive = true
}

output "primary_connection_string" {
  value     = azurerm_redis_cache.main.primary_connection_string
  sensitive = true
}
