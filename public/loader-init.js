// Script d'initialisation du loader
// Séparé pour éviter les violations CSP

(function() {
    const loaderColor = localStorage.getItem('materio-initial-loader-bg') || '#FFFFFF'
    const primaryColor = localStorage.getItem('materio-initial-loader-color') || '#9155FD'

    if (loaderColor) {
        document.documentElement.style.setProperty('--initial-loader-bg', loaderColor)
    }

    if (primaryColor) {
        document.documentElement.style.setProperty('--initial-loader-color', primaryColor)
    }
})()