import type { Directive, DirectiveBinding } from 'vue'

type GlowPosition =
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'center'
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'
    | { x: string; y: string }

interface GlowOptions {
    color?: string
    blur?: number
    size?: number
    position?: GlowPosition
}

const glowDirective: Directive<HTMLElement, GlowOptions> = {
    mounted(el: HTMLElement, binding: DirectiveBinding<GlowOptions>) {
        const color = binding.value?.color || 'rgba(173,255,0,0.5)'
        const blur = binding.value?.blur || 500
        const size = binding.value?.size || 600
        const position = binding.value?.position || 'center'

        const glow = document.createElement('div')
        glow.style.position = 'absolute'
        glow.style.width = `${size}px`
        glow.style.height = `${size}px`
        glow.style.background = `radial-gradient(circle, ${color}, transparent 70%)`
        glow.style.filter = `blur(${blur}px)`
        glow.style.pointerEvents = 'none'
        glow.style.zIndex = '0'

        switch (position) {
            case 'top':
                glow.style.top = '0'
                glow.style.left = '50%'
                glow.style.transform = 'translate(-50%, -50%)'
                break
            case 'bottom':
                glow.style.bottom = '0'
                glow.style.left = '50%'
                glow.style.transform = 'translate(-50%, 50%)'
                break
            case 'left':
                glow.style.left = '0'
                glow.style.top = '50%'
                glow.style.transform = 'translate(-50%, -50%)'
                break
            case 'right':
                glow.style.right = '0'
                glow.style.top = '50%'
                glow.style.transform = 'translate(50%, -50%)'
                break
            case 'top-left':
                glow.style.top = '0'
                glow.style.left = '0'
                glow.style.transform = 'translate(-50%, -50%)'
                break
            case 'top-right':
                glow.style.top = '0'
                glow.style.right = '0'
                glow.style.transform = 'translate(50%, -50%)'
                break
            case 'bottom-left':
                glow.style.bottom = '0'
                glow.style.left = '0'
                glow.style.transform = 'translate(-50%, 50%)'
                break
            case 'bottom-right':
                glow.style.bottom = '0'
                glow.style.right = '0'
                glow.style.transform = 'translate(50%, 50%)'
                break
            case 'center':
                glow.style.top = '50%'
                glow.style.left = '50%'
                glow.style.transform = 'translate(-50%, -50%)'
                break
            default:
                // координаты вручную (например, {x:'70%', y:'30%'})
                if (typeof position === 'object') {
                    glow.style.top = position.y
                    glow.style.left = position.x
                    glow.style.transform = 'translate(-50%, -50%)'
                }
        }

        if (!['relative', 'absolute', 'fixed'].includes(getComputedStyle(el).position)) {
            el.style.position = 'relative'
        }

        el.appendChild(glow)
    },
}

export default glowDirective
