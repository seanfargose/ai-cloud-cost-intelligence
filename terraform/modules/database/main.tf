# ============================================================
# Database Module — Azure Database for PostgreSQL Flexible Server
# ============================================================

variable "resource_group_name" { type = string }
variable "location" { type = string }
variable "project_name" { type = string }
variable "environment" { type = string }
variable "db_sku" { type = string }
variable "db_storage_mb" { type = number }
variable "db_admin_login" { type = string }
variable "db_admin_password" {
  type      = string
  sensitive = true
}
variable "subnet_id" { type = string }
variable "private_dns_zone_id" { type = string }
variable "tags" { type = map(string) }

resource "azurerm_postgresql_flexible_server" "main" {
  name                   = "psql-${var.project_name}-${var.environment}"
  resource_group_name    = var.resource_group_name
  location               = var.location
  administrator_login    = var.db_admin_login
  administrator_password = var.db_admin_password
  sku_name               = var.db_sku
  version                = "16"
  storage_mb             = var.db_storage_mb

  delegated_subnet_id = var.subnet_id
  private_dns_zone_id = var.private_dns_zone_id

  backup_retention_days        = var.environment == "prod" ? 35 : 7
  geo_redundant_backup_enabled = var.environment == "prod"

  zone = "1"

  tags = var.tags

  lifecycle {
    prevent_destroy = false  # Set to true in production
  }
}

resource "azurerm_postgresql_flexible_server_database" "main" {
  name      = "cost_optimization"
  server_id = azurerm_postgresql_flexible_server.main.id
  charset   = "utf8"
  collation = "en_US.utf8"
}

# Require SSL connections
resource "azurerm_postgresql_flexible_server_configuration" "require_ssl" {
  name      = "require_secure_transport"
  server_id = azurerm_postgresql_flexible_server.main.id
  value     = "on"
}

# ---- Outputs ----

output "server_id" {
  value = azurerm_postgresql_flexible_server.main.id
}

output "fqdn" {
  value = azurerm_postgresql_flexible_server.main.fqdn
}

output "database_name" {
  value = azurerm_postgresql_flexible_server_database.main.name
}
