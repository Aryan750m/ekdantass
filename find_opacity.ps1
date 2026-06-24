$css = Get-Content css\theme.css -Raw
$blocks = [regex]::Matches($css, '([^{]+)\{([^}]+)\}')
$zero_opacity = @()
foreach ($match in $blocks) {
    $selector = $match.Groups[1].Value.Trim()
    $props = $match.Groups[2].Value
    if ($props -match 'opacity:\s*0(?!\.\d)') {
        $selector = $selector -replace '\s+', ' '
        $zero_opacity += $selector
    }
}
$zero_opacity | Out-File zero_opacity.txt
