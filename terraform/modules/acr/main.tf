# ============================================================
# ACR Module — Azure Container Registry
# ============================================================

variable "resource_group_name" { type = string }
variable "location" { type = string }
variable "project_name" { type = string }
variable "environment" { type = string }
variable "sku" { type = string }
variable "tags" { type = map(string) }

resource "azurerm_container_registry" "main" {
  name                = replace("acr${var.project_name}${var.environment}", "-", "")
  resource_group_name = var.resource_group_name
  location            = var.location
  sku                 = var.sku
  admin_enabled       = false
  tags                = var.tags
}

# ---- Outputs ----

output "acr_id" {
  value = azurerm_container_registry.main.id
}

output "acr_name" {
  value = azurerm_container_registry.main.name
}

output "login_server" {
  value = azurerm_container_registry.main.login_server
}
