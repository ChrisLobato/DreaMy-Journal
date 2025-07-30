import { createTheme } from "@mui/material/styles"

const drieeemtheme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#b476ebff"
        },
        secondary: {
            main: "#f48fb1"
        },
        background: {
            default: "#fdfdfd",
            paper: "#ffffff"
        }
    },
    typography: {
        fontFamily: "inherit",
        h1: {
            fontWeight: 600
        },
        h2: {
            fontWeight: 500
        },
        body1: {
            fontSize: "1rem"
        },
        button:{
            textTransform: "none"
        }
    },
    shape: {
        borderRadius: 12
    }

});

export default drieeemtheme