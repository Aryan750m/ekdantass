$css_files = @('css/theme.css', 'animations.css', 'advanced-animations.css')
$js_files = @('js/site.js', 'advanced-animations.js')

foreach ($f in $css_files) {
    if (Test-Path $f) {
        $content = Get-Content $f -Raw
        $content = $content -replace '(\d{2,4})ms', '10ms'
        $content = $content -replace '(?<![\w-])(0\.\d+|[1-9]\d*)s\b', '10ms'
        Set-Content $f -Value $content -Encoding UTF8
        Write-Host "Updated $f"
    }
}

foreach ($f in $js_files) {
    if (Test-Path $f) {
        $content = Get-Content $f -Raw
        $content = $content -replace '(\d{2,4})ms', '10ms'
        $content = $content.Replace('* 90 + "ms"', '* 10 + "ms"')
        $content = $content.Replace('* 100 + "ms"', '* 10 + "ms"')
        $content = $content.Replace('8000', '10')
        $content = $content.Replace('4000', '10')
        Set-Content $f -Value $content -Encoding UTF8
        Write-Host "Updated $f"
    }
}
