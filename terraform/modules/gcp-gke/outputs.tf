output "cluster_id" {
  description = "The GKE cluster identifier"
  value       = google_container_cluster.primary.id
}

output "cluster_name" {
  description = "The GKE cluster name"
  value       = google_container_cluster.primary.name
}

output "cluster_endpoint" {
  description = "The GKE cluster API endpoint"
  value       = google_container_cluster.primary.endpoint
}

output "cluster_ca_certificate" {
  description = "Public CA certificate for GKE cluster"
  value       = google_container_cluster.primary.master_auth[0].cluster_ca_certificate
}
