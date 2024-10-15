/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/views/**/*.html.erb',
    './app/helpers/**/*.rb',
    './app/assets/stylesheets/**/*.css',
    './app/javascript/**/*.js',
    './app/views/**/*.{erb,haml,slim}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1D4ED8', // Customize primary color
        secondary: '#9333EA', // Customize secondary color,
        durBlue: "#00488B"
      },
      spacing: {
        '128': '32rem', // Example of custom spacing
      },
    },
  },
  plugins: [],
}


