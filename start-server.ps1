# Lightweight Zero-Dependency Local Web Server for JobPulse
param(
    [int]$Port = 5050
)

$HostName = "localhost"
$Prefix = "http://$HostName`:$Port/"
$RootPath = $PSScriptRoot

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($Prefix)

try {
    $listener.Start()
    Write-Host "==========================================================" -ForegroundColor Cyan
    Write-Host " JobPulse Web Server Running at: $Prefix" -ForegroundColor Green
    Write-Host " Root Directory: $RootPath" -ForegroundColor DarkCyan
    Write-Host " Press Ctrl+C in this console to stop the server." -ForegroundColor Yellow
    Write-Host "==========================================================" -ForegroundColor Cyan

    # Try launching default web browser
    try { Start-Process $Prefix -ErrorAction SilentlyContinue } catch {}

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $urlPath = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($urlPath)) {
            $urlPath = "index.html"
        }

        $filePath = Join-Path $RootPath $urlPath

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mime = switch ($ext) {
                ".html" { "text/html; charset=utf-8" }
                ".htm"  { "text/html; charset=utf-8" }
                ".css"  { "text/css; charset=utf-8" }
                ".js"   { "application/javascript; charset=utf-8" }
                ".json" { "application/json; charset=utf-8" }
                ".svg"  { "image/svg+xml" }
                ".png"  { "image/png" }
                ".jpg"  { "image/jpeg" }
                ".jpeg" { "image/jpeg" }
                ".ico"  { "image/x-icon" }
                default { "application/octet-stream" }
            }

            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentType = $mime
            $response.ContentLength64 = $bytes.Length
            $response.StatusCode = 200
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.ContentType = "text/plain"
            $response.ContentLength64 = $errBytes.Length
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
        }
        $response.Close()
    }
}
catch {
    Write-Error $_
}
finally {
    if ($listener.IsListening) {
        $listener.Stop()
    }
    $listener.Close()
}

