const defaultTheme = require('tailwindcss/defaultTheme')
var percent = {
    '1p': '1%',
    '2p': '2%',
    '3p': '3%',
    '4p': '4%',
    '5p': '5%',
    '7p': '7%',
    '10p': '10%',
    '15p': '15%',
    '20p': '20%',
    '25p': '25%',
    '30p': '30%',
    '33p': '33%',
    '40p': '40%',
    '50p': '50%',
    '67p': '67%',
    '70p': '70%',
    '75p': '75%',
    '80p': '80%',
    '85p': '85%',
    '87p': '87%',
    '90p': '90%',
    '98p': '98%'
}
var spacing = {
    ...defaultTheme.spacing,
    '18': '3rem',
    '72': '18rem',
    '84': '21rem',
    '96': '24rem',
    '128': '32rem',
    '192': '42rem',
    '256': '128rem',
}

var fonts = ['GTEestiDisplay-Medium', '-apple-system','system-ui','BlinkMacSystemFont','Segoe UI','Roboto','Oxygen-Sans','Ubuntu','Cantarell','Helvetica Neue','sans-serif','Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','sans-serif'];

module.exports = {
    theme: {
        textShadow: {
            default: '0 2px 0 #000',
            md: '0 2px 2px #000',
            h1: '0 0 3px #FF0000, 0 0 5px #0000FF',
            xl: '0 0 3px rgba(0, 0, 0, .8), 0 0 5px rgba(0, 0, 0, .9)',
            none: 'none',
        },
        fontFamily: {
            display: fonts,
            body: fonts,
        },
        aspectRatio: { // defaults to {}
            'square': [1, 1],
            '16/9': [16, 9],
            '4/3': [4, 3],
            '21/9': [21, 9],
        },
        variants: {
            aspectRatio: ['responsive'], // defaults to ['responsive']
        },
        screens: {
            'xs': {'max': '640px' },
            'sm': {'min': '640px', 'max': '767px'},
            'md': {'min': '768px', 'max': '1023px'},
            'lg': {'min': '1024px', 'max': '1279px'},
            'xl': {'min': '1280px'},
        },
        extend: {
            inset: {
                '0'  : '0',
                'full': '100%',
                ...percent
            },
            width: { ...percent },
            height: { ...percent },
            minWidth: { percent, ...spacing },
            maxWidth: { percent, ...spacing },
            minHeight: { ...spacing },
            maxHeight: { percent, ...spacing },
            marginTop: { ...percent },
            marginLeft: { ...percent },
            marginRight: { ...percent },
            marginBottom: { ...percent },
            margin: { ...percent },
            left: { ...spacing, ...percent },
            right: { ...spacing, ...percent },
            top: { ...spacing, ...percent },
            bottom: { ...spacing },
            spacing: {percent, ...spacing},
            colors: {
                gray: {
                    '100': '#FCFCFC',
                    '200': '#F4F5F7',
                    '300': '#ECECEF',
                    '400': '#DDDADF',
                    '500': '#B8B4BF',
                    '600': '#8A8594',
                    '700': '#5D5966',
                    '800': '#443E47',
                    '900': '#2A272C',
                    '1000': '#1A171C',
                    '1200': '#18151A'
                },
                warm: {
                    '100': '#FDFCFD',
                },
                blue: {
                    ...defaultTheme.colors.blue,
                    '1000': '#0d141f',
                    '1100': '#0c131e'
                }
            }
        }
    },
    plugins: [
        require('tailwindcss-aspect-ratio')(),
        require('./client/tailwind/grid')({
            grids: [1,2,3,4,5,6,7,8,10,12],
            gaps: {
                0: '0',
                2: '0.5rem',
                4: '1rem',
                8: '2rem',
            },
            variants: ['responsive'],
        }),
    ],
}