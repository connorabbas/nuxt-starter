// Theme configuration
export const theme = {
    colors: {
        gray: {
            50: '#f9fafb',
            100: '#f3f4f6',
            200: '#e5e7eb',
            400: '#9ca3af',
            500: '#6b7280',
            600: '#4b5563',
            900: '#1f2937'
        },
        brand: {
            500: '#2d3748'
        },
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        white: '#ffffff'
    },
    spacing: {
        0: '0',
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '20px',
        6: '24px',
        8: '32px',
        10: '40px',
        12: '48px'
    }
}

// Base typography styles
export const text = {
    xs: {
        fontSize: '12px',
        lineHeight: '16px'
    },
    sm: {
        fontSize: '14px',
        lineHeight: '20px'
    },
    base: {
        fontSize: '16px',
        lineHeight: '24px'
    },
    lg: {
        fontSize: '18px',
        lineHeight: '28px'
    },
    xl: {
        fontSize: '20px',
        lineHeight: '28px'
    },
    '2xl': {
        fontSize: '24px',
        lineHeight: '32px'
    },
    '3xl': {
        fontSize: '30px',
        lineHeight: '36px'
    }
}

// Font weights
export const fontWeight = {
    normal: { fontWeight: '400' },
    medium: { fontWeight: '500' },
    semibold: { fontWeight: '600' },
    bold: { fontWeight: '700' }
}

// Colors - Text (using theme)
export const textColor = {
    primary: { color: theme.colors.gray[900] },
    secondary: { color: theme.colors.gray[600] },
    muted: { color: theme.colors.gray[500] },
    light: { color: theme.colors.gray[400] },
    white: { color: theme.colors.white },
    brand: { color: theme.colors.brand[500] },
    success: { color: theme.colors.success },
    warning: { color: theme.colors.warning },
    danger: { color: theme.colors.danger }
}

// Colors - Background (using theme)
export const bgColor = {
    white: { backgroundColor: theme.colors.white },
    gray: { backgroundColor: theme.colors.gray[50] },
    grayLight: { backgroundColor: theme.colors.gray[100] },
    brand: { backgroundColor: theme.colors.brand[500] },
    success: { backgroundColor: theme.colors.success },
    warning: { backgroundColor: theme.colors.warning },
    danger: { backgroundColor: theme.colors.danger }
}

// Spacing - Padding
export const padding = {
    0: { padding: theme.spacing[0] },
    1: { padding: theme.spacing[1] },
    2: { padding: theme.spacing[2] },
    3: { padding: theme.spacing[3] },
    4: { padding: theme.spacing[4] },
    5: { padding: theme.spacing[5] },
    6: { padding: theme.spacing[6] },
    8: { padding: theme.spacing[8] },
    10: { padding: theme.spacing[10] },
    12: { padding: theme.spacing[12] }
}
export const px = {
    0: { paddingLeft: theme.spacing[0], paddingRight: theme.spacing[0] },
    1: { paddingLeft: theme.spacing[1], paddingRight: theme.spacing[1] },
    2: { paddingLeft: theme.spacing[2], paddingRight: theme.spacing[2] },
    3: { paddingLeft: theme.spacing[3], paddingRight: theme.spacing[3] },
    4: { paddingLeft: theme.spacing[4], paddingRight: theme.spacing[4] },
    5: { paddingLeft: theme.spacing[5], paddingRight: theme.spacing[5] },
    6: { paddingLeft: theme.spacing[6], paddingRight: theme.spacing[6] },
    8: { paddingLeft: theme.spacing[8], paddingRight: theme.spacing[8] },
    10: { paddingLeft: theme.spacing[10], paddingRight: theme.spacing[10] },
    12: { paddingLeft: theme.spacing[12], paddingRight: theme.spacing[12] }
}
export const py = {
    0: { paddingTop: theme.spacing[0], paddingBottom: theme.spacing[0] },
    1: { paddingTop: theme.spacing[1], paddingBottom: theme.spacing[1] },
    2: { paddingTop: theme.spacing[2], paddingBottom: theme.spacing[2] },
    3: { paddingTop: theme.spacing[3], paddingBottom: theme.spacing[3] },
    4: { paddingTop: theme.spacing[4], paddingBottom: theme.spacing[4] },
    5: { paddingTop: theme.spacing[5], paddingBottom: theme.spacing[5] },
    6: { paddingTop: theme.spacing[6], paddingBottom: theme.spacing[6] },
    8: { paddingTop: theme.spacing[8], paddingBottom: theme.spacing[8] },
    10: { paddingTop: theme.spacing[10], paddingBottom: theme.spacing[10] },
    12: { paddingTop: theme.spacing[12], paddingBottom: theme.spacing[12] }
}

// Spacing - Margin
export const margin = {
    0: { margin: theme.spacing[0] },
    1: { margin: theme.spacing[1] },
    2: { margin: theme.spacing[2] },
    3: { margin: theme.spacing[3] },
    4: { margin: theme.spacing[4] },
    5: { margin: theme.spacing[5] },
    6: { margin: theme.spacing[6] },
    8: { margin: theme.spacing[8] },
    10: { margin: theme.spacing[10] },
    auto: { margin: '0 auto' }
}
export const my = {
    0: { marginTop: theme.spacing[0], marginBottom: theme.spacing[0] },
    1: { marginTop: theme.spacing[1], marginBottom: theme.spacing[1] },
    2: { marginTop: theme.spacing[2], marginBottom: theme.spacing[2] },
    3: { marginTop: theme.spacing[3], marginBottom: theme.spacing[3] },
    4: { marginTop: theme.spacing[4], marginBottom: theme.spacing[4] },
    5: { marginTop: theme.spacing[5], marginBottom: theme.spacing[5] },
    6: { marginTop: theme.spacing[6], marginBottom: theme.spacing[6] },
    8: { marginTop: theme.spacing[8], marginBottom: theme.spacing[8] }
}
export const mb = {
    0: { marginBottom: theme.spacing[0] },
    1: { marginBottom: theme.spacing[1] },
    2: { marginBottom: theme.spacing[2] },
    3: { marginBottom: theme.spacing[3] },
    4: { marginBottom: theme.spacing[4] },
    5: { marginBottom: theme.spacing[5] },
    6: { marginBottom: theme.spacing[6] },
    8: { marginBottom: theme.spacing[8] },
    10: { marginBottom: theme.spacing[10] }
}
export const mt = {
    0: { marginTop: theme.spacing[0] },
    1: { marginTop: theme.spacing[1] },
    2: { marginTop: theme.spacing[2] },
    3: { marginTop: theme.spacing[3] },
    4: { marginTop: theme.spacing[4] },
    5: { marginTop: theme.spacing[5] },
    6: { marginTop: theme.spacing[6] },
    8: { marginTop: theme.spacing[8] },
    10: { marginTop: theme.spacing[10] }
}

// Border radius
export const rounded = {
    none: { borderRadius: '0' },
    sm: { borderRadius: '2px' },
    DEFAULT: { borderRadius: '4px' },
    md: { borderRadius: '6px' },
    lg: { borderRadius: '8px' },
    full: { borderRadius: '9999px' }
}

// Borders (using theme)
export const border = {
    DEFAULT: { border: `1px solid ${theme.colors.gray[200]}` },
    2: { border: `2px solid ${theme.colors.gray[200]}` },
    none: { border: 'none' }
}

// Text alignment
export const textAlign = {
    left: { textAlign: 'left' as const },
    center: { textAlign: 'center' as const },
    right: { textAlign: 'right' as const }
}

// Display
export const display = {
    block: { display: 'block' },
    inline: { display: 'inline' },
    inlineBlock: { display: 'inline-block' },
    none: { display: 'none' }
}

// Width utilities
export const width = {
    full: { width: '100%' },
    auto: { width: 'auto' }
}

// Component-specific styles
export const components = {
    body: {
        backgroundColor: theme.colors.gray[100],
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        margin: margin[6],
        padding: '0'
    },
    card: {
        backgroundColor: theme.colors.white,
        boxShadow: '0 2px 0 rgba(0, 0, 150, 0.025), 2px 4px 0 rgba(0, 0, 150, 0.015)',
        maxWidth: '600px',
        margin: '0 auto',
        padding: `${theme.spacing[10]} ${theme.spacing[8]}`,
        borderRadius: '8px'
    },
    btn: {
        display: 'inline-block',
        padding: `${theme.spacing[3]} ${theme.spacing[6]}`,
        fontSize: '16px',
        fontWeight: '600',
        textDecoration: 'none',
        borderRadius: '6px',
        textAlign: 'center' as const,
        lineHeight: '1.25',
        cursor: 'pointer'
    },
    btnPrimary: {
        backgroundColor: theme.colors.brand[500],
        color: theme.colors.white
    },
    btnSecondary: {
        backgroundColor: theme.colors.gray[100],
        color: theme.colors.gray[900],
        border: `1px solid ${theme.colors.gray[200]}`
    },
    divider: {
        width: '100%',
        border: 'none',
        borderTop: `1px solid ${theme.colors.gray[200]}`,
        margin: `${theme.spacing[6]} 0`
    },
    link: {
        color: '#3869d4',
        textDecoration: 'none',
        wordBreak: 'break-all' as const
    },
    breakWord: {
        wordBreak: 'break-all' as const,
        maxWidth: '100%',
        display: 'inline-block',
        whiteSpace: 'normal' as const
    }
}

// Helper function to merge styles
export const cn = (...styles: Array<Record<string, any> | undefined | false>) => {
    return Object.assign({}, ...styles.filter(Boolean))
}

// Preset combinations
export const presets = {
    heading: cn(text['2xl'], fontWeight.bold, textColor.primary, margin[0]),
    subheading: cn(text.xl, fontWeight.semibold, textColor.primary, margin[0]),

    body: cn(text.base, textColor.secondary, mb[4]),
    small: cn(text.sm, textColor.muted),
    caption: cn(text.xs, textColor.light),

    buttonPrimary: cn(components.btn, components.btnPrimary),
    buttonSecondary: cn(components.btn, components.btnSecondary),

    sectionHeader: cn(padding[8], textAlign.center),
    sectionFooter: cn(padding[8], textAlign.center),
    footerText: cn(text.xs, textColor.muted, margin[0])
}
