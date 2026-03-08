$images = @{
    "scifi_pumo_rag.jpg" = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80"
    "scifi_agent_social.jpg" = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80"
    "scifi_registry.jpg" = "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80"
    "scifi_a2a.jpg" = "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=1200&q=80"
    "scifi_marketplace.jpg" = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80"
    "scifi_collaboration.jpg" = "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&q=80"
    "scifi_achievements.jpg" = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=80"
    "scifi_tech_stack.jpg" = "https://images.unsplash.com/photo-1518433278983-e02363adb57d?w=1200&q=80"
    "scifi_dual_portal.jpg" = "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=80"
    "scifi_mcp_explained.jpg" = "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80"
    "scifi_future.jpg" = "https://images.unsplash.com/photo-1614728263952-84ea206f99b6?w=1200&q=80"
}

$destDir = "U:\The_yellow_hub\AI_AGENT_SOCIAL_CLUB\jimbo77-blog\public\blog-images"
if (!(Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir }

foreach ($name in $images.Keys) {
    $url = $images[$name]
    $dest = Join-Path $destDir $name
    Write-Host "Downloading $name from $url..."
    curl.exe -L -o $dest $url
}

Write-Host "Download complete."
